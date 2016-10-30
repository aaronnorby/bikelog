from bikelog import db

# drop all tables in case any already exist
db.drop_all()

# create the tables
db.create_all()
