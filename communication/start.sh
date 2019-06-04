parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

yarn install

if [ ! "$(docker ps -q -f name=ticket)" ]; then
  if [ "$(docker ps -aq -f status=exited -f name=ticket)" ]; then
    docker rm ticket
  fi
  
  docker rmi ticket
  docker build --tag=ticket .
  docker run -d --name ticket -p 3060 --net="host" ticket
fi

./scripts/create_schema.sh;
npm run migrate;
./scripts/create_test_schema.sh;
npm run migrate-test;