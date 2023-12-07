import React from "react";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { createSearchParams, useNavigate, useLocation } from "react-router-dom";
import logo from "./../img/Nouveau Health-logos_white.png";
import {
  Navbar,
  NavbarBrand,
  NavbarText,
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import "../css/Login.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

let LOGIN_URL = "https://nouveau-app.azurewebsites.net/login";
// let LOGIN_URL = "http://localhost:8080/login";
let GOOGLEAUTH_PATH = "/googleauth";
export default function Login() {
  let roleName = "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { caption } = location.state || {};

  if (caption === "Doctor") roleName = "doctor";
  else if (caption === "Patient") roleName = "patient";

  function handleCallbackResponse(response) {
    //console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwtDecode(response.credential);
    console.log(userObject);
    setUser(userObject);
    // document.getElementById("googleSignInDiv").hidden = true;

    axios({
      method: "post",
      url: LOGIN_URL + GOOGLEAUTH_PATH,
      data: {
        id_token: response.credential,
        roleName: roleName,
      },
    }).then(
      (response) => {
        if (response != null) {
          sessionStorage.setItem("userid", response.data.userid);
          sessionStorage.setItem("name", response.data.name);
          sessionStorage.setItem("email", response.data.email);
          sessionStorage.setItem("role", response.data.role);
          console.log(sessionStorage);
          alert("Logging you in...");
          navigate({
            pathname: "../" + response.data.role,
          });
        }
      },
      (error) => {
        console.log(error);
        alert(
          `Registration failed. There was an error saving the user. Please try again`
        );
      }
    );
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        // "881661732927-7vr8rkb2i0q11h5te0idk6ucvim2fro3.apps.googleusercontent.com",
        "881661732927-mmbgpuotn8vha5s5basldolcel8ad2cv.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      {
        theme: "outline",
        size: "large",
      }
    );
  }, []);

  const uniqueUser = async (email) => {
    const unique = await axios.get(LOGIN_URL + "/" + email);
    return unique.data?.unique;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // check all fields filled out
    if (email === "" || password === "") {
      alert("Login failed. Please fill out all fields");
      return;
    }

    // validate login
    axios({
      method: "post",
      url: LOGIN_URL,
      data: {
        email: email,
        password: password,
      },
    }).then(
      (response) => {
        sessionStorage.setItem("userid", response.data.userid);
        sessionStorage.setItem("name", response.data.name);
        sessionStorage.setItem("email", response.data.email);
        sessionStorage.setItem("role", response.data.role);
        console.log(sessionStorage);
        if (!response.data.mfa) {
          alert("Logging you in...");
          navigate({
            pathname: "../" + response.data.role,
          });
        } else {
          var result = response.data.response.result;
          if (result == "auth") {
            alert("Moving to Two-Factor Authentication");
            navigate({
              pathname: "auth",
              search:
                "?" +
                createSearchParams({
                  userid: response.data.userid,
                  role: response.data.role,
                }),
            });
          } else if (result == "allow") {
            alert("Logging you in...");

            // redirect
            navigate({
              pathname: response.data.role,
            });
          } else if (result == "deny") {
            alert("Access denied: " + response.data.response.status_msg);
            sessionStorage.clear();
            navigate("../");
          } else {
            // result == "enroll" -- shouldn't happen normally, just deny for now (in future either prompt them to enroll or set mfa to false and log them in)
            alert("Access denied");
            sessionStorage.clear();
            navigate("../");
          }
        }
      },
      (error) => {
        console.log(error);
        alert(
          `Login failed: ${error.response.data}. Please check your information and try again`
        );
      }
    );
  };

  return (
    <>
      <Navbar color="dark" dark>
        <NavbarBrand href="/">
          <img
            alt="NV Logo"
            src={logo}
            style={{
              height: 60,
              width: 60,
            }}
          />
          Nouveau Health
        </NavbarBrand>
      </Navbar>
      <div className="container">
        <div className="loginform">
          <Form onSubmit={handleSubmit} method="post">
            <h2>Login</h2>

            <FormGroup>
              <Label for="emailid">Email</Label> <br />
              <Input
                name="email"
                id="emailid"
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />{" "}
              <br /> <br />
              <Label for="passwordid">Password</Label> <br />
              <Input
                name="password"
                id="passwordid"
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </FormGroup>
            <br />

            <Button type="submit">Log in</Button>
          </Form>
        </div>
        <div className="divider"></div>
        <div className="googleSignIn">
          <div id="googleSignInDiv"></div>
        </div>
      </div>
    </>
  );
}
