import Dashboard from "../components/Dashboard";
import { Routes, Route, Outlet } from "react-router-dom";
import Doctorprofile from "../DashboardPages/DoctorProfile";
import PatientDetails from "../DashboardPages/PatientDetails";
import PatientDetailsInfo from "../DashboardPages/PatientDetailsInfo";

function DoctorDashboard() {
  return (
    <>
      <Dashboard />
      <Routes>
        <Route path="/doctorprofile" element={<Doctorprofile />} />
        <Route path="/patientdetails/*" element={<PatientDetails />} />
        <Route
          path="/patientdetails/patientdetailsInfo/:patientID/:doctorID"
          element={<PatientDetailsInfo />}
        />
      </Routes>
      <Outlet />
    </>
  );
}

export default DoctorDashboard;
