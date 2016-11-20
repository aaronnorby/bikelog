from flask import g, Blueprint, request, jsonify
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth, MultiAuth
from werkzeug.security import generate_password_hash, check_password_hash
# could also use TimedJSONWebSignatureSerializer
from itsdangerous import JSONWebSignatureSerializer as JWT
from flask_restful import Resource, Api

from bikelog import app, db
from bikelog.models import User
from bikelog.errors import ClientDataError

authentication  = Blueprint('auth', __name__)
authentication_api = Api(authentication)

jwt = JWT(app.config['SECRET_KEY'])
basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth('Bearer')
multi_auth = MultiAuth(basic_auth, token_auth)

@basic_auth.verify_password
def verify_password(username, password):
    g.user = None
    user = User.query.filter_by(username=username).first()
    if user is None:
        return False
    g.current_user = user
    return check_password_hash(user.password_hash, password)

@token_auth.verify_token
def verify_token(token):
    g.user = None
    try:
        data = jwt.loads(token)
    except:
        return False
    if 'id' in data:
        try:
            user = User.query.get(data['id'])
            g.current_user = user
        except:
            return False
        return True
    return False

@authentication_api.resource('/token')
class Token(Resource):
    @basic_auth.login_required
    def get(self):
        token = g.current_user.generate_auth_token().decode('utf-8')
        return jsonify({ 'token': token })

@authentication_api.resource('/signup')
class Signup(Resource):
    def post(self):
        """
        Register a new user
        """
        data = request.get_json()
        if data is None:
            raise ClientDataError('Request data missing')

        username = data.get('username', None)
        password = data.get('password', None)
        if username is None or password is None:
            raise ClientDataError('Must inlude username and password')
        if User.query.filter_by(username=username).first() is not None:
            raise ClientDataError('Username {} is taken'.format(username))

        password_hash = generate_password_hash(password)
        user = User(username=username, password_hash=password_hash)
        try:
            db.session.add(user)
            db.session.commit()
        except DataError:
            #TODO add logging
            db.session.rollback()
            return None, 500
        except DataBaseError:
            db.session.rollback()
            return None, 500

        return {'id': user.id}, 201
