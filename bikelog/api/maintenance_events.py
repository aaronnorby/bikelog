from datetime import datetime
from flask import Blueprint, request
from flask_restful import Resource, Api, fields, marshal_with

from bikelog import db
from bikelog.models import MaintenanceEvent, Bike
from bikelog.errors import ClientDataError
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
    def get(self, bike_id):
        """
        Get all events for the given bike.
        """
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
            raise ClientDataError('Must include request datar')

        event_date = data.get('date', None)
        description = data.get('description', None)
        note = data.get('note', None)
        bike_id = data.get('bike_id', None)

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

