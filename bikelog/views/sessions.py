from flask import Blueprint, render_template

from bikelog.api.authentication import basic_auth

sessions = Blueprint('sessions', __name__)

@sessions.route('/')
@basic_auth.login_required
def index():
    return render_template('index.html')

@sessions.route('/login')
def login():
    return render_template('login.html')
