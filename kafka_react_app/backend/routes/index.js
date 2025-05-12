const express = require('express');
const router = express.Router();
const roomController = require('../controllers/RoomController');

// -------------------ROOM-------------------------

router.get('/rooms', roomController.getRooms);
router.post('/rooms', roomController.createRoom);
router.put('/rooms/:id', roomController.updateRoom);
router.delete('/rooms/:id', roomController.deleteRoom);

// -------------------ROOM INFO-------------------------

router.get('/rooms_info/:id', roomController.getRoomInfo);
router.post('/rooms_info', roomController.createRoomInfo);
router.put('/rooms_info/:id', roomController.updateRoomInfo);
router.delete('/rooms_info/:id', roomController.deleteRoomInfo);

module.exports = router;