import Dashboard from "../components/Dashboard";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import PatientProfile from "../DashboardPages/PatientProfile";

function PatientDashboard() {
  return (
    <>
      <Dashboard />
      <Routes>
        <Route path="/patientprofile" element={<PatientProfile />} />
      </Routes>
      <Outlet />
    </>
  );
}

export default PatientDashboard;
