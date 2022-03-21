#!/bin/bash
#/mnt/LEARNING/hk212/project/smart_home_backend/build-services.sh
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

docker build "$SCRIPT_DIR/data" -t smart_home_backend/data
if [ $? -ne 0 ]; then
  echo "Failed to build docker image smart_home_backend/data"
  exit 1
fi

# docker build "$SCRIPT_DIR/control" -t safe1/control
# if [ $? -ne 0 ]; then
#   echo "Failed to build docker image safe1/control"
#   exit 1
# fi

# docker build "$SCRIPT_DIR/pipe" -t safe1/pipe
# if [ $? -ne 0 ]; then
#   echo "Failed to build docker image safe1/pipe"
#   exit 1
# fi

# docker build "$SCRIPT_DIR/auto" -t safe1/auto
# if [ $? -ne 0 ]; then
#   echo "Failed to build docker image safe1/auto"
#   exit 1
# fi

docker rmi $(docker images -f "dangling=true" -q)

echo "Successfully built safe1 services"
exit 0