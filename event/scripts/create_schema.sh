parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"
docker exec -it postgres psql -h localhost -p 5432 -U postgres -d postgres -c "$(cat ../database/create_schema.sql)"