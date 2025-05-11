const express = require('express');
const cors = require('cors');
const { kafka } = require("./client");
const { init } = require("./init-kafka");
const messages = require("./messages");

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;
const group = 'adilet';

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