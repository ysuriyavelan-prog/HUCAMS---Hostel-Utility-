import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadReadings from "./pages/UploadReadings";
import Analytics from "./pages/Analytics";
import EnergyConsumption from "./pages/EnergyConsumption"; // Added
import Alerts from "./pages/Alerts";
import StudentUsage from "./pages/StudentUsage";
import Complaints from "./pages/Complaints";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadReadings />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'WARDEN']} />}>
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'WARDEN', 'STUDENT']} />}>
          <Route path="/energy" element={<EnergyConsumption />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route path="/student/usage" element={<StudentUsage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'STUDENT']} />}>
          <Route path="/alerts" element={<Alerts />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'STUDENT', 'TECHNICIAN']} />}>
          <Route path="/complaints" element={<Complaints />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


