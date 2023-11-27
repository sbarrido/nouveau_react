import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const InsuranceNavbarData = [
    {
    title: "Home",
    path: "/insurance",
    icon: <AiIcons.AiFillHome />,
    class: "nav-text",
    },
    {
    title: "Profile",
    path: "http://localhost:3000/patientdashboard/insuranceprofile",
    icon: <AiIcons.AiFillProfile />,
    class: "nav-text",
    },
    {
    title: "Insurance",
    path: "/insurance",
    icon: <AiIcons.AiFillInsurance />,
    class: "nav-text",
    },
  {
    title: "Chat",
    path: "/insurancechat",
    icon: <AiIcons.AiFillWechat />,
    class: "nav-text",
  },
];
