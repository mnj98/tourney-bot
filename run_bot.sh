docker stop $(docker ps -q)

docker build -t tourney-bot .

docker run --restart=always -d tourney-bot
