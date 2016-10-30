import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, instance_relative_config=True)
app.config.from_pyfile('config.py')
app.config.from_envvar('APP_CONFIG_FILE')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from .models import Bike, MaintenanceEvent
from .views.sessions import sessions
from .api.bikes import bikes

@app.route('/')
def index():
    return "hellow wrld"

app.register_blueprint(sessions)
app.register_blueprint(bikes, url_prefix='/api')
