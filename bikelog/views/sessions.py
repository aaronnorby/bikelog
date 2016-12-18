from flask import Blueprint, render_template

from bikelog.api.authentication import multi_auth

sessions = Blueprint('sessions', __name__)

@sessions.route('/')
def index():
    return render_template('index.html')

@sessions.route('/login')
def login():
    return render_template('login.html')

@sessions.route('/signup')
def signup():
    return render_template('signup.html')
