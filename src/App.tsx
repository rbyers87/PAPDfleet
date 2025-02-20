import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import { useAuthStore } from './stores/authStore';
    import Layout from './components/Layout';
    import Login from './pages/Login';
    import Dashboard from './pages/Dashboard';
    import Vehicles from './pages/Vehicles';
    import WorkOrders from './pages/WorkOrders';
    import Settings from './pages/Settings';
    import NotFound from './pages/NotFound';

    function PrivateRoute({ children }: { children: React.ReactNode }) {
      const { session } = useAuthStore();
      return session ? <>{children}</> : <Navigate to="/login" />;
    }

    function App() {
      return (
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="work-orders" element={<WorkOrders />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      );
    }

    export default App;
