
echo "Восстановление базы данных из дампа..."
pg_restore -U ${POSTGRES_USER} -d ${POSTGRES_DB} /docker-entrypoint-initdb.d/backup.dump
