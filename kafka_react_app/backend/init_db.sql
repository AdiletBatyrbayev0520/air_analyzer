CREATE TABLE IF NOT EXISTS rooms (
  message_offset BIGINT PRIMARY KEY,
  topic VARCHAR(255) NOT NULL,
  temperature FLOAT NOT NULL,
  humidity FLOAT NOT NULL,
  pressure FLOAT NOT NULL,
  altitude FLOAT NOT NULL,
  co2 FLOAT NOT NULL,
  tvoc FLOAT NOT NULL,
  timestamp TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rooms_timestamp ON rooms(timestamp);

