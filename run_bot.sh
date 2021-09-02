NAME="t-bot"

./stop_bot.sh

docker build -t tourney-bot .

docker run --restart=on-failure -d --name $NAME tourney-bot
