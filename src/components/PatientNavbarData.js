import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const PatientNavbarData = [
  {
    title: "Profile",
    path: "http://localhost:3000/patientdashboard/patientprofile",
    icon: <AiIcons.AiFillProfile />,
    class: "nav-text",
  },
  {
    title: "Book an appointment",
    path: "/appointment",
    icon: <AiIcons.AiFillCalendar />,
    class: "nav-text",
  },
  {
    title: "Chat",
    path: "/patientchat",
    icon: <AiIcons.AiFillWechat />,
    class: "nav-text",
  },
  {
    title: "Feedback",
    path: "/feedback",
    icon: <IoIcons.IoIosStarHalf />,
    class: "nav-text",
  },
  {
    title: "Insurance",
    path: "/insurance",
    icon: <AiIcons.AiFillInsurance />,
    class: "nav-text",
  },
];
