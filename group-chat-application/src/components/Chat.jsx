import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRoomRoute,
  getUserRoute,
  receiveMessageRoute,
} from "../utils/apiRoutes.js";

const Chat = ({ socket }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState(undefined);
  const [userNames, setUserNames] = useState({});
  const [users, setUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server. Reason:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    return () => {
      socket.disconnect();
      socket.off("chat message");
    };
  }, [socket]);

  useEffect(() => {
    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem("currentUser"));

    if (!userInfo) {
      navigate("/login");
    } else {
      setCurrentUser(userInfo);

      socket.connect();
      socket.emit("join room", { roomId, userId: userInfo._id });
    }
    return () => {
      socket.disconnect();
    };
  }, [socket, navigate, roomId]);

  useEffect(() => {
    socket.on("online users", (users) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.off("online users");
    };
  });

  // Fetch room details and past messages
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch room details
        const roomResponse = await axios.get(`${getRoomRoute}/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoomDetails(roomResponse.data);

        // Fetch past messages
        const messagesResponse = await axios.get(
          `${getRoomRoute}/${roomId}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const allMessages = messagesResponse.data;
        setMessages(allMessages);

        const userIds = [
          ...new Set(
            allMessages
              ?.map((msg) => {
                const userId =
                  typeof msg.userId === "object" && msg.userId !== null
                    ? msg.userId[0]?._id || msg.userId[0]
                    : msg.userId;

                return userId;
              })
              .filter((id) => id !== undefined && id !== null)
          ),
        ];

        const responses = await Promise.all(
          userIds.map((id) => axios.get(`${getUserRoute}/${id}`))
        );

        const newUserNames = {};
        responses.forEach((res, index) => {
          newUserNames[userIds[index]] = res.data.result.fullName;
        });
        setUserNames(newUserNames);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, [roomId, navigate]);

  useEffect(() => {
    if (!roomDetails) {
      return;
    }
    socket.on("chat message", async (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);

      if (!userNames[msg.userId]) {
        try {
          const { data } = await axios.get(`${getUserRoute}/${msg.userId}`);
          const fullName = data.result.fullName;
          setUserNames((prev) => ({ ...prev, [msg.userId]: fullName }));
        } catch (error) {
          console.error("Error fetching user name for new message:", error);
        }
      }
    });

    return () => {
      socket.disconnect();
      socket.off("chat message");
    };
  }, [roomDetails]);

  useEffect(() => {
    socket.on("user list", (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off("user list");
    };
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const parsedUserInfo = JSON.parse(localStorage.getItem("currentUser"));
      const msg = {
        userId: parsedUserInfo._id,
        content: input,
        roomId,
      };
      socket.emit("chat message", msg); // Send the message to the server
      setInput(""); // Clear input field
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      {/* Left Column: Chat Messages */}
      <div
        style={{
          flex: 3,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #ccc",
          padding: "20px",
        }}
      >
        <h2>{roomDetails?.name}</h2>

        {/* Message Display */}
        <div
          style={{
            flex: 1,
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            // minHeight: "300px",
            // maxHeight: "400px",
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages?.map((msg, index) => {
            const userId =
              typeof msg.userId === "object" && msg.userId !== null
                ? msg.userId[0]?._id || msg.userId[0]
                : msg.userId;
            const isMine = userId === currentUser?._id;

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: isMine ? "flex-end" : "flex-start",
                  margin: "5px 0",
                }}
              >
                <div
                  style={{
                    maxWidth: "60%",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: isMine ? "#daf8cb" : "#f1f0f0",
                    textAlign: isMine ? "right" : "left",
                  }}
                >
                  {!isMine && (
                    <p style={{ margin: 0, fontWeight: "bold" }}>
                      {userNames[userId]}
                    </p>
                  )}
                  <p style={{ margin: 0 }}>{msg.content}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Form */}
        <form
          onSubmit={sendMessage}
          style={{ marginTop: "10px", display: "flex" }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{
              flexGrow: 1,
              padding: "10px",
              marginRight: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "white",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </form>
      </div>

      {/* Right Column: Participants */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#f9f9f9",
          overflowY: "scroll",
        }}
      >
        <h3>Participants</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {onlineUsers.map((user, index) => (
            <li
              key={index}
              style={{
                marginBottom: "10px",
              }}
            >
              {userNames[user.userId]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat;
