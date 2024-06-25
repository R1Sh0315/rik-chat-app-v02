import React, { useEffect, useState } from "react";
import axios from "axios";

import { FaRegBell } from "react-icons/fa6";
import Draggable from "react-draggable";

function AlertComponent() {
  // State to store the bell icon position
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [requestData, setRequestData] = useState([]);
  const username = localStorage.getItem("username");

  // Handle drag stop event
  const handleStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const removeHash = (val) => {};

  useEffect(() => {
    const fetchGroupRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/groups/requests/${username.replace(/^#/, "")}`
        );
        setRequestData(response.data);
        console.log(">>>>>", response.data);
      } catch (error) {
        console.error("Error fetching group requests:", error);
      }
    };

    fetchGroupRequests();
  }, [username]);

  const onClickHandler = () => {
    requestData.map((el) => console.log(">>>>", el.requests));
  };

  return (
    <Draggable position={position} onStop={handleStop}>
      <div className="rca-alert-container" onClick={() => onClickHandler()}>
        <FaRegBell />
        {requestData.map((el) => el.requests.length)}
      </div>
    </Draggable>
  );
}

export default AlertComponent;
