import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import reportWebVitals from './reportWebVitals';
import Root from "./routes/root";
import Landing from "./routes/landing";
import Registration from "./routes/registration";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path:"landing",
    element: <Landing />,
  },
  {
    path:"registration",
    element: <Registration />,
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
