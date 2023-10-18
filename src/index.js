import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import reportWebVitals from './reportWebVitals';
import Root from "./routes/root";
import Registration from "./routes/registration";
import DuoEnroll from "./routes/duoenroll"
import Login from "./routes/login"
import DuoAuth from "./routes/duoauth"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path:"registration",
    element: <Registration />,
  },
  {
    path:"registration/enroll",
    element: <DuoEnroll />
  },
  {
    path:"login",
    element: <Login />
  },
  {
    path:"login/auth",
    element: <DuoAuth />
  }
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
