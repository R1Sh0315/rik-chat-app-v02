import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000"); // Ensure this matches your server URL

function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const groupId = queryParams.get("groupName");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    console.log('ID >>>>', groupId)
    if (groupId) {
      socket.emit("joinGroup", groupId);

      axios
        .get(`http://localhost:5000/groups/${groupId}/messages`)
        .then((response) => setMessages(response.data))
        .catch((error) => console.error(error));

      socket.on("receiveMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log(message)
      });
    }

    return () => {
      socket.off("receiveMessage");
    };
  }, [groupId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        groupId,
        username: localStorage.getItem("username"),
        message: newMessage,
      };
      console.log(messageData)
      socket.emit("sendMessage", messageData);
      setNewMessage("");
    }
  };

  return (
    <div className="rca-fe-chatpage-container">
      <div className="rca-fe-dashboard-header">
        <div className="rca-fe-db-header-btn">
          <Button
            className="db-header-btn"
            onClick={() => navigate("/dashboard")}
            variant="outline-danger"
          >
            Back
          </Button>
        </div>
        {groupId ? `Group Chat: ${groupId}` : "Group Chat"}
      </div>
      <div className="chat-container">
        <div className="chat-history">
          {messages.map((msg, index) => (
            <div key={index} className="chat-message">
              <strong>{msg.username}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <Button variant="primary" onClick={handleSendMessage}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
