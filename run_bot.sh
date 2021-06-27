docker stop $(docker ps -q)

docker build -t tourney-bot .

docker run -d tourney-bot
