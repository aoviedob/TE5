parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

yarn install

if [ ! "$(docker ps -q -f name=payment)" ]; then
  if [ "$(docker ps -aq -f status=exited -f name=payment)" ]; then
    docker rm payment
  fi
  
  docker rmi payment
  docker build --tag=payment .
  docker run -d --name payment -p 4550 --net="host" payment
fi

./scripts/create_schema.sh;
npm run migrate;
./scripts/create_test_schema.sh;
npm run migrate-test;