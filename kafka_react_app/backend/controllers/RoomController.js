const pool = require('../config/database');

// -------------------ROOM-------------------------

exports.getRooms = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms');
    res.status(200).json(result.rows);
  } catch (err) {   
    res.status(500).json({ error: err.message });
  }
};

exports.createRoom = async (req, res) => {
  const { id, group_id } = req.body;
  try {
    const result = await pool.query('INSERT INTO rooms (id, group_id) VALUES ($1, $2) RETURNING *', [id, group_id]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRoom = async (req, res) => {
  const { id } = req.params;
  const { group_id } = req.body;  
  try {
    const result = await pool.query('UPDATE rooms SET group_id = $1 WHERE id = $2 RETURNING *', [group_id, id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM rooms WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// -------------------ROOM INFO-------------------------



exports.getRoomInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM room_info WHERE room_id = $1', [id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRoomInfo = async (req, res) => {
  const { info_id, room_id, temperature, humidity, pressure, altitude, co2, tvoc, created_at } = req.body;
  try {
    const result = await pool.query('INSERT INTO room_info (info_id, room_id, temperature, humidity, pressure, altitude, co2, tvoc, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [info_id, room_id, temperature, humidity, pressure, altitude, co2, tvoc, created_at]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRoomInfo = async (req, res) => {
  const { info_id } = req.params;
  const { room_id, temperature, humidity, pressure, altitude, co2, tvoc, created_at } = req.body;
  try {
    const result = await pool.query('UPDATE room_info SET room_id = $1, temperature = $2, humidity = $3, pressure = $4, altitude = $5, co2 = $6, tvoc = $7, created_at = $8 WHERE info_id = $9 RETURNING *', [room_id, temperature, humidity, pressure, altitude, co2, tvoc, created_at, info_id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRoomInfo = async (req, res) => {
  const { info_id } = req.params;
  try {
    await pool.query('DELETE FROM room_info WHERE info_id = $1', [info_id]);
    res.status(204).send();
  } catch (err) {   
    res.status(500).json({ error: err.message });
  }
};


