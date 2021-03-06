import functools

import pytz
import requests
from requests.auth import AuthBase
from requests.exceptions import HTTPError, RequestException

from bikelog import app
from bikelog.errors import StravaApiError

class TokenAuth(AuthBase):
    def __init__(self, token):
        self.token = token

    def __call__(self, r):
        r.headers['Authorization'] = 'Bearer' + ' {}'.format(self.token)
        return r


def get_total_miles_from_date(start_date):
    # temporary solution
    auth_token = app.config['API_TOKEN']
    try:
        strava_activities = get_strava_activities(auth_token, start_date)
    except Exception:
        raise

    tot_meters = functools.reduce(lambda x, y: x + float(y["distance"]),
                                  strava_activities,
                                  0.0)
    # truncate/round
    tot_miles = round(tot_meters / 1609.34)
    return tot_miles


def get_strava_activities(auth_token, after_date):
    """
    Get all activities for a user after a date. The date is assumed to be a naive
    datetime in UTC as is stored in the database
    """
    date_with_tz = after_date.replace(tzinfo=pytz.utc)
    after = int(date_with_tz.timestamp())
    params = {'after': after}

    try:
        resp = requests.get('https://www.strava.com/api/v3/athlete/activities',
                timeout=0.5,
                params=params,
                auth=TokenAuth(auth_token))
        resp.raise_for_status()
    except HTTPError as e:
        raise StravaApiError(e)
    except RequestException as e:
        raise StravaApiError(e)

    if resp.status_code != 200:
        raise StravaApiError(resp.reason)

    return resp.json()
