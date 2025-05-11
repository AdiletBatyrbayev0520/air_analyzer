const { kafka } = require("./client");
const messages = require("./messages");

const group = 'adilet';

async function createTopics(kafka) {
    const admin = kafka.admin();
    await admin.connect();
  
    await admin.createTopics({
      topics: [
        { topic: "f103" },
        { topic: "i111" },
        { topic: "canteen" },
        { topic: "hall" },
        { topic: "i105" },
      ],
      waitForLeaders: true,
    });
  
    console.log("Topics ensured");
    await admin.disconnect();
  }
  

async function init() {
    await createTopics(kafka);
  
    const consumer = kafka.consumer({ groupId: group });
    await consumer.connect();
    console.log('Kafka consumer connected');
  
    for (const topic of ["f103", "i111", "canteen", "hall"]) {
      await consumer.subscribe({ topic, fromBeginning: true });
    }
  
    console.log('Subscribed to topics');
  
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`Received message from topic ${topic}:`, message.value.toString());
        messages[topic].push({
          value: message.value.toString(),
          timestamp: new Date().toISOString()
        });
  
        if (messages[topic].length > 92) {
          messages[topic].shift();
        }
      },
    });
  }
  
module.exports = { init };