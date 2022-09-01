#! /bin/bash

# tail -f /dev/null

#! /bin/bash

PROJECT_NAME="authenticate"
cd /var/www/backend
# Check to see if the project exists and create a new one if not
python3 manage.py collectstatic --noinput

if [ -f manage.py ]; then
    echo "Starting webserver..."
    daphne --bind 0.0.0.0 --port 8000 authenticate.asgi:application
else
    #echo "Creating project: $PROJECT_NAME"
    #django-admin startproject $PROJECT_NAME .
    #echo "Starting webserver..."
    #python3 manage.py runserver 0.0.0.0:8000
    # echo "Creating taxi project..."
    # django-admin.py startproject taxi .
    echo "Starting webserver..."
    daphne --bind 0.0.0.0 --port 8000 authenticate.asgi:application
    #python3 manage.py runserver 0.0.0.0:8000

fi
