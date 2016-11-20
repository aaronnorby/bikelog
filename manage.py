from flask_script import Server, Manager
from flask_migrate import Migrate, MigrateCommand

from bikelog import app
from bikelog import db

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)
manager.add_command('runserver', Server())

if __name__ == '__main__':
    manager.run()
