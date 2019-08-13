parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

docker pull postgres:9.6

if [ ! "$(docker ps -q -f name=postgres)" ]; then
  if [ "$(docker ps -aq -f status=exited -f name=postgres)" ]; then
    docker stop postgres
  else
    docker run -d --name postgres -p 5432:5432 --net="host" -v pgdb:/data postgres:9.6	
  fi
 
  docker start postgres
else
  docker run -d --name postgres -p 5432:5432 --net="host" -v pgdb:/data postgres:9.6
fi

sudo apt-get install npm
sleep 30
docker exec -i postgres psql -h localhost -p 5432 -U postgres -c "ALTER USER postgres WITH PASSWORD 'mb|33_<C<kl&A*df.c8%*';"

./auth/start.sh;
./customer/start.sh;
./event/start.sh;
./ticket/start.sh;
./payment/start.sh;
./communication/start.sh;
./client/start.sh;