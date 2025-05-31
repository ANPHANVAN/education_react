import data

#. mongodb:
1. go in container:
docker compose exec -it mongodb mongosh -u username -p password --authenticationDatabase admin

2. run this line:
mongorestore \
  --drop \
  --username username \
  --password password \
  --authenticationDatabase admin \
  --db tourist_project \
  /data/backup/tourist_project

