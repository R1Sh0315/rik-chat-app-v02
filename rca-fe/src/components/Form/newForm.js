import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { RxDoubleArrowLeft } from "react-icons/rx";

function NewFormComponent() {
  const [groupName, setGroupName] = useState("");
  //   const [owner, setOwner] = useState("");
  const [needAdminAccess, setNeedAdminAccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/groups", {
        name: groupName,
        owner: localStorage.getItem("username"),
        needAdminAccess: needAdminAccess,
      });
      if (response.ok) {
        console.log("Group created successfully");
        navigate("/signin");
      } else {
        console.error("Fail to create group");
      }
      setGroupName("");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rca-group-form-container">
      <div className="rca-group-form-header">
        <RxDoubleArrowLeft className="back-btn" onClick={() => navigate("/dashboard")} />
      </div>
      <div>
        <div className="rca-group-name-input-container">
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              Group name
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </InputGroup>
        </div>
        <div className="rca-group-name-input-container">
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              onClick={() => setNeedAdminAccess(needAdminAccess)}
              onChange={(e) => setNeedAdminAccess(e.target.checked)}
              label="Need admin access"
            />
          </Form>
        </div>
      </div>
      <div className="rca-fe-footer-container">
        <Button
          className="rca-fe-fw-btn"
          variant="success"
          size="sm"
          onClick={handleSubmit}
          disabled={!groupName}
        >
          Create
        </Button>
      </div>
    </div>
  );
}

export default NewFormComponent;
