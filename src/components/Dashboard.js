import "../css/dashboard.css";
import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { PatientNavbarData } from "./PatientNavbarData";
import { DoctorNavbarData } from "./DoctorNavbarData";
import { InsuranceNavbarData } from "./InsuranceNavbar";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
const isPatient = false;

const Dashboard = (props) => {
  const [sidebar, setsidebar] = useState(false);

  let role = props.role;
  
  const showSideBar = () => {
    setsidebar(!sidebar);
  };

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSideBar} />
          </Link>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSideBar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {role === "doctor"
              ? DoctorNavbarData.map((item, index) => {
                  return (
                    <li key={index} className={item.class}>
                      <Link to={item.path}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  );
                })
              : role === "insurance"
              ? InsuranceNavbarData.map((item, index) => {
                  return (
                    <li key={index} className={item.class}>
                      <Link to={item.path}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  );
                })
              : PatientNavbarData.map((item, index) => {
                  return (
                    <li key={index} className={item.class}>
                      <Link to={item.path}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
};

export default Dashboard;
