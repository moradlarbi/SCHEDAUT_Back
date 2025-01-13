# SCHEDAUT_Back

## Database Connection
To connect to the database using Docker, run:
docker run --rm -it mysql:latest mysql -h onnjomlc4vqc55fw.chr7pe7iynqr.eu-west-1.rds.amazonaws.com -P 3306 -u e3v5vqvmprsuzjfi -p pettlxfldr9yfyx0
Password: a4dps9zul7ar1t85

JAWSDB_URL=mysql://e3v5vqvmprsuzjfi:a4dps9zul7ar1t85@onnjomlc4vqc55fw.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/pettlxfldr9yfyx0

## Test Accounts:
- admin@gmail.com / 12345678
- prof13@gmail.com / 12345678

## RabbitMQ
Start RabbitMQ using Docker:
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management

## Python Libraries:
Install the required Python libraries:
pip install pymysql pika pulp sqlalchemy pandas datetime

## Start the Back-End:
Run the development server:
yarn run dev

## Test RabbitMQ:
Run the test script for RabbitMQ:
python3 test_rabbitmq.py

## API Request Example:
To create a room via API:
curl -X POST https://humble-journey-q4rjxp6p9rwfj79-3000.app.github.dev/api/salle -H "Content-Type: application/json" -d '{"name":"Room A","capacity":30,"active":true}'
