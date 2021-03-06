from flask import jsonify

from bikelog import app

class ClientDataError(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

@app.errorhandler(ClientDataError)
def handle_client_data_error(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


class StravaApiError(Exception):
    status_code = 500

    def __init__(self, message='', status_code=None, payload=None):
        Exception.__init__(self)
        self.message = 'There was a problem retrieving data from Strava. {}'.format(message)
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

@app.errorhandler(StravaApiError)
def handle_strava_api_error(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response
