const { Kafka } = require("kafkajs");

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


exports.kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"],
});