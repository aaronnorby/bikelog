from datetime import datetime, date
from flask import Blueprint, request
from flask_restful import Resource, Api, fields, marshal_with

from bikelog import db
from bikelog.models import Bike
from bikelog.errors import ClientDataError

bikes = Blueprint('bikes', __name__)
bikes_api = Api(bikes)

class PurchasedDate(fields.Raw):
    def format(self, value):
        return value.strftime("%Y-%m-%d")

resource_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'purchased_at': PurchasedDate
}

@bikes_api.resource('/bike/<int:bike_id>', '/bike')
class BikeApi(Resource):
    @marshal_with(resource_fields)
    def get(self, bike_id):
        bike = Bike.query.get_or_404(bike_id)
        return bike

    def post(self):
        """
        Create a new bike.
        """
        data = request.get_json()

        if data is None:
            raise ClientDataError('Must include request data')

        purchased = data.get('purchased_at', None)
        name = data.get('name', None)
        if name is None:
            raise ClientDataError('Must include name field')

        if purchased is None:
            raise ClientDataError('Must include purchased_at field', 400)

        try:
            fmt_purchased = datetime.strptime(purchased, '%Y-%m-%d')
        except ValueError:
            raise ClientDataError('Date {} must be formatted YYYY-MM-DD'
                .format(purchased))

        fmt_purchased = date(fmt_purchased.year, fmt_purchased.month,
                fmt_purchased.day)
        bike = Bike(name, fmt_purchased)

        try:
            db.session.add(bike)
            db.session.commit()
        except DataError:
            return None, 400
        except DataBaseError:
            return None, 500

        return {'id': bike.id}



