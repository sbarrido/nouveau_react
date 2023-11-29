import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/DoctorProfile.css";

function PatientDetails() {
  let BASE_URL = "http://localhost:8080";
  const doctorId = 3;
  const [patientData, setPatientData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/doctordashboard/patientdetails`,
          {
            doctorId: doctorId,
          }
        );
        setPatientData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePatientClick = () => {};

  const handleClick = () => {};
  return (
    <>
      <div className="flexbox" id="patientBox">
        <div className="patientBox">
          {patientData.map((item, index) => {
            return (
              <div
                className="patients"
                key={index}
                onClick={handlePatientClick}
              >
                <div className="patient-name">
                  Patient Name: {item.patientName}
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={handleClick}>GET</button>;
      </div>
    </>
  );
}

export default PatientDetails;
