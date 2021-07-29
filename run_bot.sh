docker stop $(docker ps -q)

docker build -t tourney-bot .

docker run --restart=on-failure -d tourney-bot
