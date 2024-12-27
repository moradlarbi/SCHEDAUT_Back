import amqp from "amqplib";

export const sendEventToQueue = async (event) => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@studious-lamp-95vrxjwj7q9c64x-5672.app.github.dev");
    const channel = await connection.createChannel();

    const queue = "events_queue"; // Nom de la queue pour les événements
    await channel.assertQueue(queue, { durable: true });

    // Publie l'événement sous forme de JSON
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)));
    console.log("Événement envoyé :", event);

    // Ferme la connexion
    setTimeout(() => connection.close(), 500);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'événement :", error.message);
  }
};
