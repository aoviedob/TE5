if [ ! "$(docker ps -q -f name=auth)" ]; then
  docker stop auth
fi

if [ ! "$(docker ps -q -f name=customer)" ]; then
  docker stop customer
fi

if [ ! "$(docker ps -q -f name=event)" ]; then
  docker stop event
fi

if [ ! "$(docker ps -q -f name=ticket)" ]; then
  docker stop ticket
fi

if [ ! "$(docker ps -q -f name=payment)" ]; then
  docker stop payment
fi

if [ ! "$(docker ps -q -f name=postgres)" ]; then
  docker stop postgres
fi

if [ ! "$(docker ps -q -f name=comm)" ]; then
  docker stop comm
fi
