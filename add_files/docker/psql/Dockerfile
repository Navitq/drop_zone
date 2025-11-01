FROM postgres:16

ARG POSTGRES_PASSWORD
ARG POSTGRES_USER
ARG POSTGRES_DB

COPY database_backup/backup.dump /docker-entrypoint-initdb.d/backup.dump

COPY database_backup/set_database.sh /docker-entrypoint-initdb.d/set_database.sh
RUN chmod 644 /docker-entrypoint-initdb.d/set_database.sh

CMD ["docker-entrypoint.sh", "postgres"]
