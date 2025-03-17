const express = require('express');
const cors = require('cors');
const { kafka } = require("./client");

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;
const group = 'adilet';
const messages = {
  f103: [],
  i111: [], 
  canteen: [],
  hall: []
};

async function init() {
  const consumer = kafka.consumer({ groupId: group });
  await consumer.connect();
  console.log('Kafka consumer connected');

  await consumer.subscribe({ topics: ["f103", "i111", "canteen", "hall"], fromBeginning: true });
  console.log('Subscribed to topics');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message from topic ${topic}:`, message.value.toString());
      messages[topic].push({
        value: message.value.toString(),
        timestamp: new Date().toISOString()
      });
      
      if (messages[topic].length > 5) {
        messages[topic].shift();
      }
    },
  });
}

app.get('/api/messages', (req, res) => {
  console.log('Received request for messages');
  const allMessages = Object.entries(messages).flatMap(([topic, msgs]) => 
    msgs.map(msg => ({
      topic,
      ...msg
    }))
  );
  console.log('Sending messages:', allMessages);
  res.json(allMessages);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

init().catch(console.error);