FROM mysql:latest

COPY init.sql /docker-entrypoint-initdb.d/

ENV MYSQL_DATABASE team_database
ENV MYSQL_PASSWORD password
ENV MYSQL_ROOT_PASSWORD password
