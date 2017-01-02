GULP = $(PWD)/node_modules/.bin/gulp
KARMA = $(PWD)/node_modules/.bin/karma

deprecated_start:
		APP_CONFIG_FILE=$(PWD)/config/development.py \
		python run.py

start:
		python manage.py runserver

make_db:
		APP_CONFIG_FILE=$(PWD)/config/development.py \
		python make_db.py

gulp:
	$(GULP) run

test_client:
	$(KARMA) start

.PHONY: start make_db gulp test_client run
