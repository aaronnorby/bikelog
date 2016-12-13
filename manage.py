from flask_script import Server, Shell, Manager
from flask_migrate import Migrate, MigrateCommand

from bikelog import app
from bikelog import db
from bikelog import models

migrate = Migrate(app, db)
manager = Manager(app)

def make_shell_context():
    return dict(app=app, db=db, models=models)

manager.add_command('shell', Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)
manager.add_command('runserver', Server(threaded=True))

if __name__ == '__main__':
    manager.run()
