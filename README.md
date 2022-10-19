Deployment
==========

Cassandra Error: "seed provider lists no seeds":

This error is caused by not setting the environment var: CASSANDRA_BROADCAST_ADDRESS. Default value should be 127.0.0.1


Angular
*******

If the container fails to start, comment out the "tail dev/null" and comment "ng serve" line. Then bash into the container and run npm install. If that fails, delete the package.json in the project parent folder and rerun npm install. The only thing the Docker file actually needs is node and Angular CLI installed.

Angular Error: "javascript run out of memory" on ng serve OR the development server is killed: Check your container memory allocation. It should be set to at least 4GB and then set the "node max_old_file" line in the entrypoint to 4096.

If the backend containers fail to start and Kafka Registry Error is thrown, make sure they can communicate with Kafka. Check your vpn settings.