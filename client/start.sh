parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

yarn install

if [ ! "$(docker ps -q -f name=client)" ]; then
  if [ "$(docker ps -aq -f status=exited -f name=client)" ]; then
    docker rm client
  fi
  
  docker rmi client
  docker build --tag=client .
  docker run -d --name client -p 5112 --net="host" client
fi
