const { Kafka } = require('kafkajs');
const { kafka } = require("./config/kafka");
const messages = require("./messages");
const pool = require("./config/database");
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
        
        try {
          const data = JSON.parse(message.value.toString());
          
          const roomCheck = await pool.query(
            'SELECT id FROM rooms WHERE id = $1',
            [topic]
          );

          if (roomCheck.rows.length === 0) {
            await pool.query(
              'INSERT INTO rooms (id, group_id) VALUES ($1, $2)',
              [topic, `${group}-${partition}`]
            );
            console.log(`Room ${topic} created with group ${group}-${partition}`);
          }else{
            console.log(`Room ${topic} already exists`);
          }
          
          const infoId = `${topic}-${partition}-${message.offset}-${new Date().toISOString()}`; 
          
          console.log(`Processing message with offset: ${message.offset}`);
          
          await pool.query(
            `INSERT INTO room_info (
              info_id, room_id, temperature, humidity, 
              pressure, altitude, co2, tvoc, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              infoId,
              topic,
              Math.round(data.temperature),
              Math.round(data.humidity),
              Math.round(data.pressure),
              Math.round(data.altitude),
              Math.round(data.co2),
              Math.round(data.tvoc),
              new Date()
            ]
          );
          console.log(`Room info ${infoId} created`);

          messages[topic].push({
            value: message.value.toString(),
            timestamp: new Date().toISOString()
          });
    
          if (messages[topic].length > 92) {
            messages[topic].shift();
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      },
    });
  }
  
module.exports = { init };