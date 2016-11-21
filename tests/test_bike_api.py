from flask import Flask, jsonify
from flask_testing import TestCase
from werkzeug.datastructures import Headers

from bikelog import app, db
from bikelog.models import User
from tests.helpers import add_user_and_bike

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

class TestBikeApi(BaseTestCase):
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


