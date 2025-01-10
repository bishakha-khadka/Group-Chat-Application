import { Message, Room } from "../schema/model.js";

export let createRoom = async (req, res) => {
  const { name, members } = req.body;
  const room = new Room({ name, members });
  await room.save();
  res.json(room);
};

export let getAllRooms = async (req, res) => {
  const rooms = await Room.find(); // Fetch all rooms
  res.json(rooms);
};

export let getRoomDetails = async (req, res) => {
  const { roomId } = req.params;
  const room = await Room.findById(roomId).populate("members", "name");
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json(room);
};

export let getMessagesForRoom = async (req, res) => {
  const { roomId } = req.params;
  const messages = await Message.find({ room: roomId }).populate(
    "userId",
    "name"
  );
  res.json(messages);
};
