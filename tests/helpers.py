from datetime import datetime

from bikelog.models import User, Bike

def add_user(db, username):
    password = 'password'
    password_hash = User.generate_user_password_hash(password)
    user = User(username, password_hash)
    db.session.add(user)
    db.session.commit()
    return user, password

def add_bike(db, user):
    purchased_at = datetime(year=2015, month=2, day=21)
    bike = Bike(name='Huffy', purchased_at=purchased_at, user=user)
    db.session.add(bike)
    db.session.commit()
    return bike


def add_user_and_bike(db, username):
    user, password = add_user(db, username)
    bike = add_bike(db, user)
    return user, bike, password
