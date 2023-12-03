import * as React from "react";
import * as ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Root from "./routes/root";
import Registration from "./routes/registration";
import DuoEnroll from "./routes/duoenroll";
import Login from "./routes/login";
import DuoAuth from "./routes/duoauth";
import InsuranceHome from "./routes/insurancehome";
import Search from "./routes/search";
import Appointment from "./routes/appointment";
import PatientHome from "./routes/patienthome";
import DoctorHome from "./routes/doctorhome";
import PatientProfile from "./routes/patientprofile";
import DoctorProfile from "./routes/doctorprofile";
import InsuranceProfile from "./routes/insuranceprofile";
import DoctorView from "./routes/doctorview";
import PatientInsurance from "./routes/patientinsurance";
import InsurancePlans from "./routes/providerinsuranceplans";
import DoctorDashboard from "./routes/doctordashboard";
import PatientDashboard from "./routes/patientdashboard";
import ChatApp from "./DashboardPages/ChatApp";
import PatientDetails from "./DashboardPages/PatientDetails";
import PatientDetailsInfo from "./DashboardPages/PatientDetailsInfo";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "registration",
    element: <Registration />,
  },
  {
    path: "registration/enroll",
    element: <DuoEnroll />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "login/auth",
    element: <DuoAuth />,
  },
  {
    path: "insurance",
    element: <InsuranceHome />,
  },
  {
    path: "search",
    element: <Search />,
  },
  {
    path: "appointment",
    element: <Appointment />,
  },

  {
    path: "patient",
    element: <PatientHome />,
  },
  {
    path: "patient/profile",
    element: <PatientProfile />,
  },
  {
    path: "patient/doctorview",
    element: <DoctorView />,
  },
  {
    path: "patient/patientchat",
    element: <ChatApp />,
  },
  {
    path: "patient/insurance",
    element: <PatientInsurance />,
  },
  {
    path: "doctor",
    element: <DoctorHome />,
  },
  {
    path: "doctor/profile",
    element: <DoctorProfile />,
  },
  {
    path: "doctor/doctorchat",
    element: <ChatApp />,
  },
  {
    path: "doctor/patientdetails/*",
    element: <PatientDetails />,
  },
  {
    path: "doctor/patientdetails/patientdetailsInfo/:patientID/:doctorID",
    element: <PatientDetailsInfo />,
  },

  {
    path: "insurance/doctorchat",
    element: <InsuranceProfile />,
  },
  {
    path: "insurance/plans",
    element: <InsurancePlans />,
  },
  {
    path: "doctordashboard/*",
    element: <DoctorDashboard />,
  },
  {
    path: "patientdashboard/*",
    element: <PatientDashboard />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
