start:
		APP_CONFIG_FILE=$(PWD)/config/development.py \
		python run.py

make_db:
		APP_CONFIG_FILE=$(PWD)/config/development.py \
		python make_db.py

.PHONY: start
