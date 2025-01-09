import pika
import subprocess

# RabbitMQ connection details
RABBITMQ_HOST = 'localhost'
QUEUE_NAME = 'update_queue'

# Callback function for processing messages
def callback(ch, method, properties, body):
    print(f" [x] Received {body.decode()}")
    print(" [x] Executing test_cnx.py...")

    # Execute the test_cnx.py script
    try:
        result = subprocess.run(
            ["python3", "test_cnx.py"], capture_output=True, text=True
        )
        if result.returncode == 0:
            print(" [x] Script executed successfully!")
            print(" [x] Script Output:\n", result.stdout)  # Print the standard output of the script
        else:
            print(" [x] Script execution failed with code:", result.returncode)
            print(" [x] Script Error Output:\n", result.stderr)  # Print the error output if the script fails
    except Exception as e:
        print(f" [x] Error executing script: {e}")

# Main function to connect and consume messages
def main():
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
        channel = connection.channel()

        # Declare the queue (must match the queue used in the producer)
        channel.queue_declare(queue=QUEUE_NAME, durable=False)

        print(f" [*] Waiting for messages from queue '{QUEUE_NAME}'. To exit, press CTRL+C")

        # Start consuming messages
        channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback, auto_ack=True)
        channel.start_consuming()
    except KeyboardInterrupt:
        print("Exiting...")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
