const { Kafka } = require("kafkajs");
const dotenv = require('dotenv');

dotenv.config();

const brokers = (process.env.KAFKA_BROKERS || 'kafka:9092').split(',');
console.log('Connecting to Kafka brokers:', brokers);

exports.kafka = new Kafka({
  clientId: "backend-service",
  brokers: brokers,
  retry: {
    initialRetryTime: 1000,
    retries: 10,
    maxRetryTime: 30000,
    factor: 2
  },
  connectionTimeout: 10000,
  requestTimeout: 30000
});