yarn install

if [ ! "$(docker ps -q -f name=comm)" ]; then
  if [ "$(docker ps -aq -f status=exited -f name=comm)" ]; then
    docker rm comm
  fi
  
  docker rmi comm
  docker build --tag=comm .
  docker run -d --name comm -p 3065 --net="host" comm
fi
