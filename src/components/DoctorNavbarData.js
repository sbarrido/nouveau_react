import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const DoctorNavbarData = [
    {
        title: "Home",
        path: "/doctor",
        icon: <AiIcons.AiFillHome />,
        class: "nav-text",
    },
    {
        title: "Profile",
        path: "/doctor/profile",
        icon: <AiIcons.AiFillProfile />,
        class: "nav-text",
    },
    {
        title: "Patients Details",
        path: "/doctordashboard/patientdetails",
        icon: <AiIcons.AiFillCalendar />,
        class: "nav-text",
    },
    {
        title: "Chat",
        path: "/doctordashboard/doctorchat",
        icon: <AiIcons.AiFillWechat />,
        class: "nav-text",
    },
];
