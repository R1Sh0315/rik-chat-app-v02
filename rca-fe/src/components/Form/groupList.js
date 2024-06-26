import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Button from "react-bootstrap/Button";
import AlertComponent from "../notification/alertComponent";

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  const [joinGrp, setJoinGrp] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:5000/groups");
        setGroups(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGroups();
  }, []);

  const handleJoin = async (groupId, groupName) => {
    console.log(`Joining group with ID: ${groupId}`);
    try {
      const response = await axios.post("http://localhost:5000/groups/join", {
        groupId,
        username: localStorage.getItem("username"),
      });
      // Update the local group state with the updated group information
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group._id === groupId ? response.data : group
        )
      );
      setJoinGrp(!joinGrp);
      navigate(`/group-chat?groupName=${groupName}`); // Pass groupName as query parameter
    } catch (error) {
      console.error(error);
    }
  };

  const handleRequest = async (groupId) => {
    console.log(`Requesting access to group with ID: ${groupId}`);
    try {
      await axios.post("http://localhost:5000/groups/request", {
        groupId,
        username: localStorage.getItem("username"),
      });
      // Optionally, you could update the UI to reflect that a request has been sent
    } catch (error) {
      console.error(error);
    }
  };

  const openGroupHandler = (groupId) => {
    console.log(`Opening group with ID: ${groupId}`);
    // setOpenGroup(true);
    // Implement open group logic here
  };

  const renderButton = (
    currentOwner,
    groupOwner,
    needAccess,
    groupId,
    members,
    groupName
  ) => {
    if (currentOwner === groupOwner) {
      return null; // No button for the owner
    } else {
      if (needAccess) {
        return (
          <Button
            variant="outline-success"
            onClick={() => handleRequest(groupId, currentOwner)}
          >
            Request
          </Button>
        );
      } else {
        return (
          <>
            {!members?.includes(currentOwner) ? (
              <Button
                variant="outline-success"
                onClick={() => handleJoin(groupId, groupName)} // Pass groupName to handleJoin
              >
                Join
              </Button>
            ) : null}
          </>
        );
      }
    }
  };

  const navToGrpChat = (grp) => {
    if (grp.members.includes(localStorage.getItem("username"))) {
      navigate(`/group-chat?groupName=${grp.name}`);
    }
  };

  return (
    <div className="rca-card-container">
      <div className="rca-card-channel-title">
        <h2>Channels</h2>
        <AlertComponent  />
      </div>
      <div className="rca-card-content">
        {groups.map((group) => (
          <div
            className="rca-card-cell"
            key={group._id}
            onClick={() => {
              if (localStorage.getItem("username") === group.owner) {
                openGroupHandler(group._id);
              }
              navToGrpChat(group);
            }}
          >
            <div className="rca-card-cell-icon">{group.owner[0]}</div>
            <div className="rca-card-cell-body">
              {group.name}-{group.owner}-{group.grpType}
            </div>
            <div>
              {group.members?.includes(localStorage.getItem("username"))
                ? console.log("yes")
                : console.log("No")}
            </div>
            <div className="rca-card-cell-btn">
              {renderButton(
                localStorage.getItem("username"),
                group.owner,
                group.needAdminAccess,
                group._id,
                group.members,
                group.name // Pass groupName to renderButton
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupList;
