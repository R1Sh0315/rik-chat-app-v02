import React, { useContext } from "react";
import AuthContext from "../service/AuthContext";
import Button from "react-bootstrap/Button";
import { RiAddLargeFill } from "react-icons/ri";
import { FaPowerOff } from "react-icons/fa6";

function DashboardComponent() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="rca-fe-dashboard-container">
      <div className="rca-fe-dashboard-header">
        <div className="rca-fe-db-header-btn" >
          <Button className="db-header-btn" onClick={logout} variant="outline-danger">
            <FaPowerOff />
          </Button>
        </div>
        <div className="rca-fe-db-header-uname">{localStorage.getItem('username') || 'Dashboard' }</div>
        <div className="rca-fe-db-header-btn" >
          <Button className="db-header-btn" variant="outline-success">
            <RiAddLargeFill />
          </Button>
        </div>
      </div>
    </div>
  );
}
export default DashboardComponent;
