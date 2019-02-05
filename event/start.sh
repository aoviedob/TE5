parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

yarn install

if [ ! "$(docker ps -q -f name=event)" ]; then
  if [ "$(docker ps -aq -f status=exited -f name=event)" ]; then
    docker rm event
  fi
  
  docker rmi event
  docker build --tag=event .
  docker run -d --name event -p 3050 --net="host" event
fi

./scripts/create_schema.sh;
npm run migrate;
./scripts/create_test_schema.sh;
npm run migrate-test;