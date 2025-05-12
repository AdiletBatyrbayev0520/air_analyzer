CREATE TABLE rooms (
    id TEXT PRIMARY KEY,
    group_id TEXT
);

CREATE TABLE room_info (
    info_id TEXT PRIMARY KEY,
    room_id TEXT REFERENCES rooms(id),
    temperature INT,
    humidity INT,
    pressure INT,
    altitude INT,
    co2 INT,
    tvoc INT,
    created_at TIMESTAMP
);
