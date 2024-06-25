import React from "react";
// import { FaPowerOff } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";

function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const groupName = queryParams.get("groupName");
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
        {groupName ? `Group Chat: ${groupName}` : "Group Chat"}
      </div>
    </div>
  );
}

export default ChatPage;
