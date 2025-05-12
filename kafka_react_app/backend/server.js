const express = require('express');
const cors = require('cors');
const { kafka } = require("./config/kafka");
const { init } = require("./init-kafka");
const messages = require("./messages");
const routes = require('./routes');
const { body, validationResult } = require('express-validator');
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 5000;
const group = 'adilet';


app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});


app.use('/api', routes);


app.post('/rooms', [
  body('id').notEmpty(),
  body('group_id').notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], routes);

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


app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

init().catch(console.error);