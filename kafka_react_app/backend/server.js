const express = require('express');
const cors = require('cors');
const { kafka } = require("./client");
const dotenv = require('dotenv');
const { init: initDB, pool } = require('./database');
dotenv.config();

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;
const group = process.env.KAFKA_GROUP_ID || 'backend-group';
const CHART_LENGTH = 90; // Максимальное количество точек на графике
const messages = {
  f103: [],
  i111: [], 
  canteen: [],
  hall: []
};


async function init() {
  let consumer;
  try {
    consumer = kafka.consumer({ 
      groupId: group,
      sessionTimeout: 60000,
      heartbeatInterval: 10000,
      maxWaitTimeInMs: 5000,
      maxBytesPerPartition: 1048576,
      retry: {
        retries: 10
      }
    });

    await consumer.connect();
    console.log('Kafka consumer connected');

    await consumer.subscribe({ 
      topics: Object.keys(messages), 
      fromBeginning: true 
    });
    console.log('Subscribed to topics');

    await consumer.run({
      autoCommit: true,
      autoCommitInterval: 5000,
      autoCommitThreshold: 100,
      eachMessage: async ({ topic, partition, message }) => {
        try {
          console.log(`Received message from topic ${topic}:`, message.value.toString());
          
          const data = JSON.parse(message.value.toString());
          console.log('Parsed data:', data);
          
          await initDB();
          
          const temperature = data.temperature;
          const humidity = data.humidity;
          const pressure = data.pressure;
          const altitude = data.altitude;
          const co2 = data.co2;
          const tvoc = data.tvoc;
          
          const options = { timeZone: 'Asia/Almaty' }; // UTC+5
          const datetime = new Date().toLocaleString('en-US', options);

          await pool.query(
            `INSERT INTO ${process.env.PG_TABLE || 'rooms'} 
            (message_offset, topic, temperature, humidity, pressure, altitude, co2, tvoc, timestamp) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, 
            [message.offset, topic, temperature, humidity, pressure, altitude, co2, tvoc, datetime]
          );
          
          console.log(`Inserted data into PostgreSQL: topic: ${topic}, temperature: ${temperature}, humidity: ${humidity}, pressure: ${pressure}, altitude: ${altitude}, co2: ${co2}, tvoc: ${tvoc}, timestamp: ${datetime}`);
          
          messages[topic].push({
            value: message.value.toString(),
            timestamp: datetime
          });
          
          if (messages[topic].length > CHART_LENGTH) {
            messages[topic].shift();
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      },
    });
  } catch (error) {
    console.error('Error initializing Kafka consumer:', error);
    // Переподключение через 5 секунд
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      init().catch(console.error);
    }, 5000);
  }
}

app.get('/api/messages', (req, res) => {
  try {
    console.log('Received request for messages');
    const allMessages = Object.entries(messages).flatMap(([topic, msgs]) => 
      msgs.map(msg => ({
        topic,
        ...msg
      }))
    );
    console.log('Sending messages:', allMessages);
    res.json(allMessages);
  } catch (error) {
    console.error('Error handling API request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

init().catch(error => {
  console.error('Failed to initialize application:', error);
});