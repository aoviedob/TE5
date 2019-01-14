docker pull postgres:9.6
docker volume create pgdb

if [ ! "$(docker ps -q -f name=postgres)" ]; then
  if [ "$(docker ps -aq -f status=exited -f name=postgres)" ]; then
    docker rm postgres
  fi
 
  docker run -d --name postgres -p 5432:5432 -v pgdb:/data postgres:9.6
fi

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn

docker build --tag=auth .
if [ ! "$(docker ps -q -f name=auth)" ]; then
  if [ "$(docker ps -aq -f status=exited -f name=auth)" ]; then
    docker rm auth
  fi
 
  docker run -d --name auth -p 3000:3000 auth
fi

docker exec -it postgres psql -h localhost -p 5432 -U postgres -c "ALTER USER postgres WITH PASSWORD 'mb|33_<C<kl&A*df.c8%*';"

./scripts/create_schema.sh;
./scripts/migrate.sh;
./scripts/create_test_schema.sh;
npm run migrate-test;