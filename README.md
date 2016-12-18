# BikeLog

Very much a work in progress.

## Getting started

Bikelog is written using python 3, so make sure you have that installed and on your
path.

Next, install the requirements:

```
pip install -r requirements.txt
```

Bikelog uses postgres as its database, so a postgres server must be running and
accessible for it to work, and have a database created. Log into your postgres
server and create the database (in this case, we're calling it `bikelog`, but that
isn't necessary):

```
create database bikelog;
```

Next we need to configure the app. It's set up to use an instance config file and,
if preset, a `config.py` file at the root of the project. The `config.py` file will
override any configurations in the instance file.

The instance file should look something like this:

```
# instance/config.py
SECRET_KEY = 'YOUR APP SECRET KEY'
SQL_ALCHEMY_DATABASE_URI = 'postgres://localhost/bikelog'

DEBUG = True
DEVELOPMENT = True

API_TOKEN = 'YOUR STRAVA API TOKEN'
```

A couple things to note. First, this is set up so the instance config is a
development config. Put prod config in a config.py file at the root of the project
directory. Replace the postgres uri with wherever your db server is (in
this case, we're assuming it's running locally and the database is named
'bikelog'). Second, the app secret key must be generated in a cryptographically
secure way. Here's one method (note that if you simply follow the instructions in
the Flask docs, you will get an error because the output of `os.urandom(24)` is
type bytes, but Flask needs a string):

```
> import os
> from base64 import b64encode
> b64encode(os.urandom(64)).decode('utf-8')
'alongstring=='
```

Just copy and paste the resulting string into the config file.

Now that the configuration is done, you can run the app's development server:

```
python manage.py runserver
```

You can also access the app via shell:

```
python manage.py shell
```

Finally, migrations are handled with Flask-Migrate via Alembic. To create a new
migration:

```
python manage.py db migrate
```

To upgrade to the latest db version:

```
python manage.py db upgrade
```

And that's about it. Note that because this app handles authentication via basic
auth and jwt tokens, it must be served over https to be secure.
