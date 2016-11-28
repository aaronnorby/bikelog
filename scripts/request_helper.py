import requests
from requests.auth import AuthBase
import pytz

import argparse
from datetime import datetime

parser = argparse.ArgumentParser()

parser.add_argument('-u', '--username', help='username')
parser.add_argument('-p', '--password', help='password')

args = parser.parse_args()

class TokenAuth(AuthBase):
    def __init__(self, token):
        self.token = token

    def __call__(self, r):
        r.headers['Authorization'] = 'Bearer' + ' {}'.format(self.token)
        return r


def get_token(username, password):
    resp = requests.get("http://localhost:5000/token", auth=(username, password))
    data = resp.json()
    return data['token']

def post_bike(username, password, name, purchased_at=None):
    token = get_token(username, password)
    if purchased_at is None:
        purchased_at = "2015-04-07-00-00"
    payload = {'name': name, 'purchased_at': purchased_at}
    resp = requests.post("http://localhost:5000/api/bike",
                         json=payload,
                         auth=TokenAuth(token))
    return resp

def get_bike(username, password, bike_id):
    token = get_token(username, password)
    resp = requests.get('http://localhost:5000/api/bike/{}'.format(bike_id),
                        auth=TokenAuth(token))

def post_maint_event(username, password, date, description, bike_id, note=''):
    token = get_token(username, password)
    payload = {
                'date': date,
                'description': description,
                'bike_id': bike_id,
                'note': note
              }
    resp = requests.post('http://localhost:5000/api/maintenance_events',
                         json=payload,
                         auth=TokenAuth(token))
    return resp

def get_maintenance_events(username, password, bike_id):
    token = get_token(username, password)
    resp = requests.get('http://localhost:5000/api/maintenance_events/{}'.format(bike_id),
                        auth=TokenAuth(token))
    return resp

def get_strava_activities(auth_token, after_date):
    """
    Get all activities for a user after a date. The date is assumed to be a naive
    datetime in UTC as is stored in the database
    """
    date_with_tz = after_date.replace(tzinfo=pytz.utc)
    after = int(date_with_tz.timestamp())
    params = {'after': after}

    resp = requests.get('https://www.strava.com/api/v3/athlete/activities',
                        params=params,
                        auth=TokenAuth(auth_token))
    return resp



# Allow this to be used as a command-like script
if args.password and args.username:
    token = get_token(args.username, args.password)
    print(token)
