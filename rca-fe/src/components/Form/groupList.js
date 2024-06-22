// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Button from "react-bootstrap/Button";

// const GroupList = () => {
//   const [groups, setGroups] = useState([]);
//   const [openGroup, setOpenGroup] = useState(false);

//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/groups");
//         setGroups(response.data);
//         console.log(response.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchGroups();
//   }, []);

//   //   same owner and needaccess: yes = no Button
//   //   diff. owner and needaccess: no = join Button
//   //   diff. owner and needaccess = request Button

//   const buttonHandler = (currentOwner, groupOwner, needAccess) => {
//     if (currentOwner === groupOwner) {
//       setOpenGroup(true);
//       return "";
//     } else {
//       if (needAccess) {
//         return <Button variant="outline-success">Request</Button>;
//       } else {
//         return <Button variant="outline-success">Join</Button>;
//       }
//     }
//   };

//   const openGroupHandelr = () => {
//     console.log("Open");
//   };

//   return (
//     <div className="rca-card-container">
//       <h2>Channels</h2>
//       <div className="rca-card-content">
//         {groups.map((group) => (
//           <div
//             className="rca-card-cell"
//             key={group._id}
//             onClick={openGroup ? openGroupHandelr : ""}
//           >
//             <div className="rca-card-cell-icon">{group.owner[0]}</div>
//             <div className="rca-card-cell-body">
//               {group.name} {group.owner}
//             </div>
//             <div className="rca-card-cell-btn">
//               {buttonHandler(
//                 localStorage.getItem("username"),
//                 group.owner,
//                 group.needAdminAccess
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GroupList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [openGroup, setOpenGroup] = useState(false);

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

  const handleJoin = (groupId) => {
    console.log(`Joining group with ID: ${groupId}`);
    // Implement join group logic here
  };

  const handleRequest = (groupId) => {
    console.log(`Requesting access to group with ID: ${groupId}`);
    // Implement request access logic here
  };

  const openGroupHandler = (groupId) => {
    console.log(`Opening group with ID: ${groupId}`);
    // setOpenGroup(true);
    // Implement open group logic here
  };

  const renderButton = (currentOwner, groupOwner, needAccess, groupId) => {
    if (currentOwner === groupOwner) {
      return null; // No button for the owner
    } else {
      if (needAccess) {
        return (
          <Button
            variant="outline-success"
            onClick={() => handleRequest(groupId)}
          >
            Request
          </Button>
        );
      } else {
        return (
          <Button variant="outline-success" onClick={() => handleJoin(groupId)}>
            Join
          </Button>
        );
      }
    }
  };

  return (
    <div className="rca-card-container">
      <h2>Channels</h2>
      <div className="rca-card-content">
        {groups.map((group) => (
          <div
            className="rca-card-cell"
            key={group._id}
            onClick={() =>
              localStorage.getItem("username") === group.owner
                ? openGroupHandler(group._id)
                : ""
            }
          >
            <div className="rca-card-cell-icon">{group.owner[0]}</div>
            <div className="rca-card-cell-body">
              {group.name} {group.owner}
            </div>
            <div className="rca-card-cell-btn">
              {renderButton(
                localStorage.getItem("username"),
                group.owner,
                group.needAdminAccess,
                group._id
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupList;
