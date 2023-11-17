import Dashboard from "../components/Dashboard";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Doctorprofile from "../DashboardPages/DoctorProfile";
import ChatApp from "../DashboardPages/ChatApp";
function DoctorDashboard() {
  return (
    <>
      <Dashboard />
      <Routes>
        <Route path="/doctorprofile" element={<Doctorprofile />} />
        <Route path="/doctorchat" element={<ChatApp />} />
      </Routes>
      <Outlet />
    </>
  );
}

export default DoctorDashboard;
