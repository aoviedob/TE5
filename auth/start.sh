yarn install

if [ ! "$(docker ps -q -f name=auth)" ]; then
  if [ "$(docker ps -aq -f status=exited -f name=auth)" ]; then
    docker rm auth
  fi
  
  docker rmi auth
  docker build --tag=auth .
  docker run -d --name auth -p 3000 --net="host" auth
fi

./scripts/create_schema.sh;
npm run migrate;
./scripts/create_test_schema.sh;
npm run migrate-test;