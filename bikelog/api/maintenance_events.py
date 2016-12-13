from datetime import datetime

from flask import Blueprint, request, g
from flask_restful import Resource, Api, fields, marshal_with

from bikelog import db, app
from bikelog.models import MaintenanceEvent, Bike
from bikelog.api.helpers import get_total_miles_from_date
from bikelog.errors import ClientDataError, StravaApiError
from .authentication import token_auth

maint_events = Blueprint('maintenance_events', __name__)
maint_events_api = Api(maint_events)

class EventDate(fields.Raw):
    def format(self, value):
        # note time is in utc
        return value.strftime("%Y-%m-%d-%H-%M")

@maint_events_api.resource('/maintenance_events/<int:bike_id>',
        '/maintenance_events')
class MaintenanceEventsApi(Resource):
    """
    Endpoint for interacting with maintenance events for a specific bike.
    """

    resource_fields = {
        'id': fields.Integer,
        'date': EventDate,
        'description': fields.String,
        'note': fields.String,
        'bike_id': fields.Integer
    }

    @token_auth.login_required
    @marshal_with(resource_fields)
    def get(self, bike_id=None):
        """
        Get all events for the given bike.
        """
        if bike_id is None:
            raise ClientDataError('bike_id is required')
        bike = Bike.query.get_or_404(bike_id)
        if bike.user_id != g.user.id:
            return None, 403
        events = bike.maintenance_events
        return events

    @token_auth.login_required
    def post(self):
        """
        Create a new maintenance event.
        """
        data = request.get_json()

        if data is None:
            raise ClientDataError('Must include request date')

        event_date = data.get('date', None)
        description = data.get('description', None)
        note = data.get('note', None)
        bike_id = data.get('bike_id', None)

        if bike_id is None:
            raise ClientDataError('Must include bike id')

        if event_date is None:
            raise ClientDataError('Must include date of event', 400)
        try:
            fmt_event_date = datetime.strptime(event_date, '%Y-%m-%d-%H-%M')
        except ValueError:
            raise ClientDataError('Date {} must be formatted YYYY-MM-DD-HH-mm'
                    .format(event_date))

        if description is None:
            raise ClientDataError('Must include event description')

        bike = Bike.query.get_or_404(bike_id)

        event = MaintenanceEvent(fmt_event_date, description, note, bike)

        try:
            db.session.add(event)
            db.session.commit()
        except DataError:
            db.session.rollback()
            return None, 400
        except DataBaseError:
            db.session.rollback()
            return None, 500

        return {'id': event.id}


@maint_events_api.resource('/maintenance_event/distance/<int:bike_id>')
class Distance(Resource):
    """
    Distances between maintenance events of a given type
    """

    @token_auth.login_required
    def get(self, bike_id=None):
        """
        Get the distance ridden since the last maintenance event of the given type

        Required params:
            :type: [string]maintenance event description field
        """
        if bike_id is None:
            raise ClientDataError('bike_id is required')
        bike = Bike.query.get_or_404(bike_id)
        if bike.user_id != g.user.id:
            raise ClientDataError('Bike with id {} not found for user {}'.format(bike_id, g.user.id),
                    status_code=403)
        event_type = request.args.get('type', '')
        if event_type == '':
            raise ClientDataError('Must include event type in query string')
        events = sorted(bike.maintenance_events, key=lambda x: x.date)
        last_event_date = None
        for event in events:
            if event.description == event_type:
                last_event_date = event.date
                break
        try:
            if last_event_date is None:
                # never happened. return total miles and note
                bike_purchase_date = bike.purchased_at
                miles = get_total_miles_from_date(bike_purchase_date)
                event_found = False
            else:
                miles = get_total_miles_from_date(last_event_date)
                event_found = True
        except StravaApiError as e:
            app.logger.error('Error getting miles: {}'.format(e.message))
            raise StravaApiError()

        return {'miles': miles, 'event_found': event_found}, 200
