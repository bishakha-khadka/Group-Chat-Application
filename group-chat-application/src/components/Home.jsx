import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoomRoute } from "../utils/apiRoutes.js";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import Profile from "./Profile.jsx";

const Home = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(getRoomRoute, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(response.data); // Assume the response is a list of rooms
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const handleEnterRoom = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        getRoomRoute,
        { name: newRoomName, members: currentUser._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRooms((prevRooms) => [...prevRooms, response.data]); // Add the new room to the list
      setNewRoomName(""); // Clear the input
      setIsCreatingRoom(false);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          backgroundColor: "#f4f4f4",
          borderRight: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ padding: "10px" }}>Rooms</h3>
          <FaPlus
            style={{
              cursor: "pointer",
              //   color: "#4CAF50",
              fontSize: "1.2em",
            }}
            onClick={() => setIsCreatingRoom(true)}
          />
        </div>
        <ul style={{ listStyleType: "none", padding: 0, width: "100%" }}>
          {rooms.map((room) => (
            <li
              key={room._id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                marginBottom: "10px",
                // backgroundColor: "#fff",
                borderRadius: "8px",
                cursor: "pointer",
                // boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "background-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onClick={() => handleEnterRoom(room._id)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#e0e0e0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#f4f4f4")
              }
            >
              {/* Room Name */}
              <span
                style={{ fontSize: "1.1em", fontWeight: "500", color: "#333" }}
              >
                {room.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", position: "relative" }}>
        {/* Profile Dropdown */}
        <div style={{ position: "absolute", top: "20px", right: "20px" }}>
          <Profile user={currentUser.firstName} />
        </div>
        <h1>Welcome to Group Chat</h1>
        {currentUser && (
          <p>
            Hello,{" "}
            <strong>
              {currentUser.firstName} {currentUser.lastName}
            </strong>
            !
          </p>
        )}
        <p>Connect with others in the chatroom or create a new room.</p>
      </div>
      {/* Create Room Modal */}
      {isCreatingRoom && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            padding: "20px",
            zIndex: 1000,
            width: "90%",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          {/* Create a new room */}
          <h3 style={{ marginBottom: "20px", color: "#333" }}>
            Create a New Room
          </h3>
          <input
            type="text"
            placeholder="Enter room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "1em",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={handleCreateRoom}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Create Room
            </button>
            <button
              onClick={() => setIsCreatingRoom(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
