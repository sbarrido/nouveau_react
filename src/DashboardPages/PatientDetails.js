import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../css/DoctorProfile.css";
import { Routes, Route, Outlet } from "react-router-dom";
import PatientDetailsInfo from "./PatientDetailsInfo";

const PATIENTSDETAILSINFORROUTE = "/doctor/patientdetails/patientdetailsInfo";
let DetailsInfo = [];
let BASE_URL = "http://localhost:8080";
const doctorID = 3;

function PatientDetails() {
  const [patientData, setPatientData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/doctor/patientdetails`, {
          doctorID: doctorID,
        });
        setPatientData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePatientClick = (index) => {
    const patientID = patientData[index].ID;
    const patientName = patientData[index].patientName;
    console.log(patientID, patientName);
    console.log(DetailsInfo);
    navigate(`${PATIENTSDETAILSINFORROUTE}/${patientID}/${doctorID}`);
  };

  return (
    <>
      <div className="flexbox" id="patientBox">
        <div className="patientBox">
          {patientData.map((item, index) => (
            <div
              className="patients"
              id="patients"
              key={index}
              onClick={() => handlePatientClick(index)}
            >
              <div className="patient-name">
                Patient Name: {item.patientName}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <Outlet>
              <Route
                path={`${PATIENTSDETAILSINFORROUTE}/:patientID/:doctorID`}
                element={<PatientDetailsInfo />}
              />
            </Outlet>
          }
        />
      </Routes>
    </>
  );
}

export default PatientDetails;
