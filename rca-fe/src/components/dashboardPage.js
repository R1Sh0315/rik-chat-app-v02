import React, { useContext } from 'react';
import AuthContext from '../service/AuthContext';

function DashboardComponent(){
    const { logout } = useContext(AuthContext);

    return <div className="rca-fe-dashboard-container">
        Dashboard

        <div onClick={logout}>Logout</div>
    </div>
}
export default DashboardComponent;