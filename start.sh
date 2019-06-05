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

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn

docker exec -it postgres psql -h localhost -p 5432 -U postgres -c "ALTER USER postgres WITH PASSWORD 'mb|33_<C<kl&A*df.c8%*';"

./auth/start.sh;
./customer/start.sh;
./event/start.sh;
./ticket/start.sh;
./payment/start.sh;
./communication/start.sh;