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
    path: "/insurance/profile",
    icon: <AiIcons.AiFillProfile />,
    class: "nav-text",
    },
    {
    title: "Edit Insurance Plans",
    path: "/insurance/plans",
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
