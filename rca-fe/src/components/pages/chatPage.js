import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import io from "socket.io-client";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineMinusCircle } from "react-icons/ai";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import {
  MdOutlineAddReaction,
  MdOutlineThumbUp,
  MdInfoOutline,
  MdClose,
} from "react-icons/md";
import { HiMiniMinusCircle } from "react-icons/hi2";

import axios from "axios";

const socket = io("http://localhost:5000"); // Ensure this matches your server URL

function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const groupId = queryParams.get("groupName");
  const [addUser, setaddUser] = useState(true);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userList, setUserList] = useState([]);
  const [isInfoOpen, setInfoOpen] = useState(false);
  const [groupMembers, setGroupMembers] = useState({});

  useEffect(() => {
    if (groupId) {
      socket.emit("joinGroup", groupId);

      axios
        .get(`http://localhost:5000/groups/${groupId}/messages`)
        .then((response) => setMessages(response.data))
        .catch((error) => console.error(error));

      socket.on("receiveMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log(message);
      });

      axios
        .get(`http://localhost:5000/groups/${groupId}/members`)
        .then((response) => setGroupMembers(response.data))
        .catch((error) =>
          console.error("Error fetching group members:", error)
        );
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
      console.log(messageData);
      socket.emit("sendMessage", messageData);
      setNewMessage("");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) {
      axios
        .get(`http://localhost:5000/users/search?q=${e.target.value}`)
        .then((response) => setUserList(response.data))
        .catch((error) => console.error(error));
    } else {
      setUserList([]);
    }
  };

  const filteredUsers = userList.filter(
    (user) => user.username !== localStorage.getItem("username")
  );

  const addUserHandler = (username) => {
    axios
      .post("http://localhost:5000/groups/add-member", {
        groupId,
        username,
      })
      .then((response) => {
        console.log(response.data.message);
        // Optionally update the UI or notify the user
      })
      .catch((error) => {
        console.error("Error adding user to group:", error);
        // Optionally show an error message to the user
      });
  };

  const likeMessage = async (messageId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/messages/${messageId}/like`,
        {
          username: localStorage.getItem("username"),
        }
      );
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, likes: msg.likes + 1 } : msg
        )
      );
    } catch (error) {
      console.error("Error liking message:", error);
    }
  };

  const memberDelHandler = (member) => {
    axios
      .post("http://localhost:5000/groups/remove-member", {
        groupId,
        username: member,
      })
      .then((response) => {
        console.log(response.data.message);
        // Update the state to remove the member from the list
        setGroupMembers((prevMembers) => ({
          ...prevMembers,
          members: prevMembers?.members?.filter((m) => m !== member),
        }));

        if (groupMembers.members?.length > 2) {
          setInfoOpen(!isInfoOpen);
        } else {
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.error("Error removing member from group:", error);
        // Optionally show an error message to the user
      });
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
        <div onClick={() => setInfoOpen(!isInfoOpen)}>
          {groupId ? `${groupId}` : "Group Chat"}
          <MdInfoOutline className="rca-info-icon" />
        </div>
        {addUser ? (
          <div className="rca-fe-db-header-btn">
            <Button
              className="db-header-btn add-user-btn"
              onClick={() => setaddUser(!addUser)}
              variant="outline-success"
            >
              <IoMdAdd />
            </Button>
          </div>
        ) : (
          <div className="rca-fe-db-header-btn">
            <Button
              className="db-header-btn add-user-btn"
              onClick={() => setaddUser(!addUser)}
              variant="outline-danger"
            >
              <AiOutlineMinusCircle />
            </Button>
          </div>
        )}
      </div>

      {/* search member */}
      {!addUser ? (
        <div className="chat-user-search">
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              Search
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </InputGroup>

          {filteredUsers.length > 0 && (
            <div className="user-list">
              {filteredUsers.map((user, key) => (
                <div
                  key={user._id}
                  className="user-item"
                  onClick={() => addUserHandler(user.username)}
                >
                  {user.username}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        ""
      )}

      {/* info card */}
      {isInfoOpen ? (
        <div className="rca-info-container">
          <div className="rca-info-content">
            <div className="rca-close-btn-container">
              <MdClose onClick={() => setInfoOpen(!isInfoOpen)} />
            </div>
            <div className="rca-info-body">
              <div className="rca-h3">Members</div>
              <div className="rca-grp-member-list-container">
                {groupMembers.member.map((member, key) => (
                  <div key={key} className="rca-member-slab">
                    <>{member}</>
                    <>
                      {member !== groupMembers.owner ? (
                        <HiMiniMinusCircle
                          onClick={() => memberDelHandler(member)}
                          className="rca-member-del"
                        />
                      ) : (
                        ""
                      )}
                    </>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="chat-container">
        <div className="chat-history">
          {messages.map((msg, index) => (
            <div className="chat-body" key={index}>
              <div key={index} className={`chat-message `}>
                <div
                  className={`chat-body ${
                    localStorage.getItem("username") === msg.username
                      ? "user-chat"
                      : "other-chat"
                  }`}
                >
                  <span
                    className={`user ${
                      localStorage.getItem("username") === msg.username
                        ? "user-right"
                        : "client-left"
                    }`}
                  >
                    {msg.username}
                  </span>
                  <span className="divider">:</span>
                  <span
                    className={`msg ${
                      localStorage.getItem("username") === msg.username
                        ? "user-left"
                        : "client-right"
                    }`}
                  >
                    {msg.message}
                  </span>
                  {localStorage.getItem("username") !== msg.username ? (
                    <div
                      className="like-container"
                      onClick={() => likeMessage(msg._id)}
                    >
                      {msg.likes.length ? (
                        <>
                          <MdOutlineThumbUp />
                        </>
                      ) : msg.likes.length >= 2 ? (
                        <>
                          <MdOutlineThumbUp />
                          <span className="like">{msg.likes.length}</span>
                        </>
                      ) : (
                        <>
                          <MdOutlineAddReaction />
                        </>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
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
