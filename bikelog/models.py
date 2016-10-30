from datetime import date

from bikelog import db

class MaintenanceEvent(db.Model):
    """
    Events where maintenance was performed on a bike. Has foreign key to a bike.
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.Date, default=date.today())
    description = db.Column(db.String(140))
    note = db.Column(db.String(140))
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
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    purchased_at = db.Column(db.Date)

    def __init__(self, name, purchased_at):
        self.name = name
        self.purchased_at = purchased_at

    def __repr__(self):
        return '<Bike {}>'.format(self.name)
