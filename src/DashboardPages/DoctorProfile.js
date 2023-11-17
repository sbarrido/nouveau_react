import React from "react";
import "../css/DoctorProfile.css";

const PATIENT = [
  {
    name: "Mayur",
    id: "20012",
  },
  {
    name: "Kirtan",
    id: "20013",
  },
  {
    name: "Aditya",
    id: "20014",
  },
  {
    name: "Subhadra",
    id: "20015",
  },
];

function Doctorprofile() {
  const handlePatientClick = () => {
    alert("hi");
  };
  return (
    <>
      <div className="flexbox" id="patientBox">
        <div className="patientBox">
          {/* <div className="patients">
            <div>Patient Name</div>
            <div>Patient Id</div>
          </div>
          <div className="patients">
            <div>Patient Name</div>
            <div>Patient Id</div>
          </div>
          <div className="patients">
            <div>Patient Name</div>
            <div>Patient Id</div>
          </div> */}

          {PATIENT.map((item, index) => {
            return (
              <div
                className="patients"
                key={index}
                onClick={handlePatientClick}
              >
                <div>Patient Name: {item.name}</div>
                <div>Patient Id: {item.id}</div>
              </div>
            );
          })}
        </div>
      </div>
      ;
    </>
  );
}

export default Doctorprofile;
