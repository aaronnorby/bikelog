from datetime import datetime

from itsdangerous import JSONWebSignatureSerializer as JWT
from werkzeug.security import generate_password_hash

from bikelog import app, db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(32), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)

    def __init__(self, username, password_hash):
        self.username = username
        self.password_hash = password_hash

    def generate_auth_token(self):
        jwt = JWT(app.config['SECRET_KEY'])
        token = jwt.dumps({'id': self.id})
        return token

    @staticmethod
    def generate_user_password_hash(password):
        return generate_password_hash(password)

    def __repr__(self):
        return '<User {}>'.format(self.id)

class MaintenanceEvent(db.Model):
    """
    Events where maintenance was performed on a bike. Has foreign key to a bike.
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)
    description = db.Column(db.String(140))
    note = db.Column(db.String(140), nullable=True)
    bike_id = db.Column(db.Integer, db.ForeignKey('bike.id'), nullable=False)
    bike = db.relationship('Bike',
            backref=db.backref('maintenance_events'))

    def __init__(self, date, description, note, bike):
        self.date = date
        self.description = description
        self.note = note
        self.bike = bike

    def __repr__(self):
        return '<Maint {} {}>'.format(self.date, self.description)


class Bike(db.Model):
    """
    An individual bike.
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    purchased_at = db.Column(db.DateTime(), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('bikes'))

    def __init__(self, name, purchased_at, user):
        self.name = name
        self.purchased_at = purchased_at
        self.user = user

    def __repr__(self):
        return '<Bike {}>'.format(self.name)
