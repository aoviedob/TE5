parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

if [ ! "$(docker ps -q -f name=customer)" ]; then
  if [ "$(docker ps -aq -f status=exited -f name=customer)" ]; then
    docker rm customer
  fi
  
  docker rmi customer
  docker build --tag=customer .
  docker run -d --name customer -p 3030:3030 --net="host" customer
fi

./scripts/create_schema.sh;
npm run migrate;
./scripts/create_test_schema.sh;
npm run migrate-test;