from datetime import datetime

from bikelog import db

class MaintenanceEvent(db.Model):
    """
    Events where maintenance was performed on a bike. Has foreign key to a bike.
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)
    description = db.Column(db.String(140))
    note = db.Column(db.String(140), nullable=True)
    bike_id = db.Column(db.Integer, db.ForeignKey('bike.id'))
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

    def __init__(self, name, purchased_at):
        self.name = name
        self.purchased_at = purchased_at

    def __repr__(self):
        return '<Bike {}>'.format(self.name)
