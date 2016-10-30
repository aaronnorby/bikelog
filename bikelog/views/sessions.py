from flask import Blueprint

sessions = Blueprint('sessions', __name__)

@sessions.route('/login')
def login():
    return "Enter your username and password"
