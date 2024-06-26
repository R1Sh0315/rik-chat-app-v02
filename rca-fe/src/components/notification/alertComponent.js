import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

import axios from "axios";

import { FaRegBell } from "react-icons/fa6";
import Draggable from "react-draggable";

function AlertComponent() {
  // State to store the bell icon position
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [requestData, setRequestData] = useState([]);
  const [toDisplay, setDisplay] = useState(false);

  const username = localStorage.getItem("username");

  // Handle drag stop event
  const handleStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  useEffect(() => {
    const fetchGroupRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/groups/requests/${username.replace(/^#/, "")}`
        );
        const reArrange = response.data.flatMap((item) =>
          item.requests.map((request) => ({
            groupId: item.groupId,
            groupName: item.groupName,
            request,
          }))
        );
        setRequestData(reArrange);
      } catch (error) {
        console.error("Error fetching group requests:", error);
      }
    };

    fetchGroupRequests();
  }, [username]);

  const onClickHandler = () => {
    requestData.map((el) => console.log(">>>>", el));
    setDisplay(!toDisplay);
  };

  return (
    <>
      <Draggable position={position} onStop={handleStop}>
        <div className="rca-alert-container" onClick={() => onClickHandler()}>
          <FaRegBell />
          {requestData.length}
        </div>
      </Draggable>
      {toDisplay ? (
        <div
          className="rca-alert-container"
          onClick={() => setDisplay(!toDisplay)}
        >
          {requestData.map((el, key) => (
            <div className="rca-alert-card" key={key}>
              <div className="rca-alert-msg">
                {el.request} Requesting permission for {el.groupName}
              </div>
              <Button
                // onClick={() => navigate("/group-form")}
                className="alert-accept-btn"
                variant="outline-success"
              >
                Accept
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

export default AlertComponent;
