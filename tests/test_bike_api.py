from flask import Flask, jsonify, json
from flask_testing import TestCase
from werkzeug.datastructures import Headers

from bikelog import app, db
from bikelog.models import User, Bike
from tests.helpers import add_user_and_bike, add_user

class BaseTestCase(TestCase):
    def create_app(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/bikelog_test'
        return app

    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

class TestGetBike(BaseTestCase):
    def test_get_bike_requires_auth(self):
        user, bike, password = add_user_and_bike(db=db, username='nobody')
        resp = self.client.get('/api/bike/{}'.format(bike.id))
        self.assertEqual(401, resp.status_code)

    def test_get_bike(self):
        user, bike, password = add_user_and_bike(db=db, username='someone')
        token = user.generate_auth_token().decode('utf-8')
        hs = Headers()
        hs.add('Authorization', 'Bearer {}'.format(token))
        resp = self.client.open('/api/bike/{}'.format(bike.id),
                         headers=hs)

        self.assertEqual(200, resp.status_code)
        self.assertEqual(bike.id, resp.json['id'])


class TestCreateBike(BaseTestCase):
    def test_create_bike_requires_auth(self):
        resp = self.client.post('/api/bike')

        self.assertEqual(401, resp.status_code)

    def test_create_bike_creates_bike(self):
        user, password = add_user(db=db, username='person')
        token = user.generate_auth_token().decode('utf-8')
        hs = Headers()
        hs.add('Authorization', 'Bearer {}'.format(token))
        hs.add('Content-Type', 'application/json')
        req_data = json.dumps(dict(name='Felt',
                                   purchased_at='2016-01-21-00-00'))
        resp = self.client.post('/api/bike',
                                headers=hs,
                                data=req_data)

        created_bike = Bike.query.get(resp.json['id'])

        self.assertEqual(201, resp.status_code)
        self.assertEqual('Felt', created_bike.name)

