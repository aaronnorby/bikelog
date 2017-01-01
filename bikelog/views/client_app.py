from flask import Blueprint, render_template

from bikelog.api.authentication import multi_auth

client_app = Blueprint('client_app', __name__)

@client_app.route('/')
@client_app.route('/maint')
@client_app.route('/login')
def index():
    return render_template('index.html')
