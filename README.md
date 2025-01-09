# SCHEDAUT_Back
connect db: docker run --rm -it mysql:latest mysql -h onnjomlc4vqc55fw.chr7pe7iynqr.eu-west-1.rds.amazonaws.com -P 3306 -u e3v5vqvmprsuzjfi -p pettlxfldr9yfyx0
password: a4dps9zul7ar1t85

JAWSDB_URL=mysql://e3v5vqvmprsuzjfi:a4dps9zul7ar1t85@onnjomlc4vqc55fw.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/pettlxfldr9yfyx0

compte test: admin@gmail.com 12345678
prof13@gmail.com 12345678

//rabbitmq
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management

python libraries: pip install pymysql pika pulp sqlalchemy pandas datetime

yarn run dev
python3 test_rabbitmq.py

curl -X POST https://humble-journey-q4rjxp6p9rwfj79-3000.app.github.dev/api/salle -H "Content-Type: application/json" -d '{"name":"Room A","capacity":30,"active":true}'