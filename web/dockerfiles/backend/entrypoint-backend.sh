#! /bin/bash

# tail -f /dev/null

#! /bin/bash

# PROJECT_NAME='dispatchSocket1'
cd /var/www/backend
# Check to see if the project exists and create a new one if not
python3 manage.py collectstatic --noinput

if [ -f manage.py ]; then
    echo "Starting webserver..."
    daphne --bind 0.0.0.0 --port 8000 dispatchSocket1.asgi:application
else
    echo "Creating project: dispatchSocket1"
    django-admin startproject dispatchSocket1 .
    #echo "Starting webserver..."
    #python3 manage.py runserver 0.0.0.0:8000
    # echo "Creating taxi project..."
    # django-admin.py startproject taxi .
    # echo "Creating new... Starting webserver..."
    daphne --bind 0.0.0.0 --port 8000 dispatchSocket1.asgi:application
    #python3 manage.py runserver 0.0.0.0:8000

fi
