#! /bin/bash
echo "##############################################################################"
echo "##############################################################################"
echo "##############################################################################"
echo "##############################################################################"
echo ""

echo ""
echo "Setting files and folders writeable..."
cd $PROJECT_DIR
chmod -R 777 $PROJECT_DIR

echo ""
echo "Checking for project..."

if [ -d $PROJECT_DIR/educationMain ]; then 
    if [ "$(ls -A $PROJECT_DIR/educationMain)" ]; then
    
        echo "Project exists. Starting up..."
    else
        echo "Deleting empty project folder..."
        rmdir $PROJECT_DIR/educationMain
        echo "Error! The frontend directory does not have the right files..."
        ng new educationMain
    fi
else
    echo "Error! The frontend directory does not have the right files..."
    ng new educationMain
fi
cd $PROJECT_DIR/educationMain

# ng update @angular/cli @angular/core --allow-dirty --force && \
# npm i -g react-popper @popperjs/core && \
# npm i uuid@8.3.2 && \
# npm i -g @angular-devkit/build-angular@12.2.5

# npm uninstall typescript && \
# npm install typescript@4.3.2 && \
# ng add rxjs@6.6.7 --skip-confirmation && \
# ng add @ngrx/store@12.4.0 --skip-confirmation && \
# ng add @ngrx/effects@12.4.0 --skip-confirmation && \
# ng add @ngrx/store-devtools@12.4.0 --skip-confirmation && \
# ng add @ngrx/router-store@12.4.0 --skip-confirmation && \
# ng add bootstrap@5.1.1 --skip-confirmation && \
# ng add ngx-bootstrap-icons@1.5.3 --skip-confirmation && \
# ng add jquery@3.6.0 --skip-confirmation && \
# ng add bootswatch@4.5.2 --skip-confirmation && \
# npm i faker @types/faker --save-dev
ng add @angular/material


echo ""
echo "##############################################################################"
echo ""
echo "Starting angular webserver..."

echo $PWD
ng serve --host "0.0.0.0" --port "4200" --disable-host-check
#ng serve --host "0.0.0.0"