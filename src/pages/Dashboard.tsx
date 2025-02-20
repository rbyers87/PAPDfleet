import React from 'react';
    import { Link } from 'react-router-dom';
    import { useAuthStore } from '../stores/authStore';

    function Dashboard() {
      const { isAdmin } = useAuthStore();

      return (
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to the Police Fleet Management System!</p>
          {isAdmin && (
            <Link to="/settings" className="text-blue-600 hover:text-blue-800">
              Go to Settings
            </Link>
          )}
        </div>
      );
    }

    export default Dashboard;
