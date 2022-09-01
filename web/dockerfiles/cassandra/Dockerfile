FROM cassandra:4.0

RUN apt-get update && apt install apt-transport-https ca-certificates curl software-properties-common -y
RUN apt install nano

COPY cassandra.yaml /etc/cassandra/cassandra.yaml
# RUN echo "authenticator: PasswordAuthenticator" >> /etc/cassandra/cassandra.yaml

