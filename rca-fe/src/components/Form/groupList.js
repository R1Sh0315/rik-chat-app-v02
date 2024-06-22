import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GroupList = () => {
  const [groups, setGroups] = useState([]);

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

  return (
    <div>
      <h2>Groups</h2>
      <ul>
        {groups.map((group) => (
          <li key={group._id}>
            {group.name} (Owner: {group.owner})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;
