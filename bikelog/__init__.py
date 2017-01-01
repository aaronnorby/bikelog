import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, instance_relative_config=True)
# config.py will override instance config if it exists
app.config.from_pyfile('config.py', silent=True)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from .models import User, Bike, MaintenanceEvent
from .views.client_app import client_app as client_view
from .api.bikes import bikes
from .api.maintenance_events import maint_events
from .api.authentication import authentication

app.register_blueprint(client_view)
app.register_blueprint(bikes, url_prefix='/api')
app.register_blueprint(maint_events, url_prefix='/api')
app.register_blueprint(authentication)
