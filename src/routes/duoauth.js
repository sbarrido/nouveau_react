import React from 'react';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {createSearchParams, useNavigate} from 'react-router-dom'
import logo from './../img/Nouveau Health-logos_white.png';
import {Navbar, NavbarBrand, NavbarText, Button, Col, Form, FormGroup, Input, Label, Row, Spinner} from 'reactstrap';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

let REGISTRATION_URL = "https://nouveau-app.azurewebsites.net/login/auth";
//let REGISTRATION_URL = "http://localhost:8080/login/auth"
export default function DuoEnroll() {
    const searchParams = new URLSearchParams(window?.location?.search);
    const userid = searchParams.get('userid')
    const role = searchParams.get('role')
    const [loading, setLoading] = useState(true);
    let call = true
    //const [userid, setUserid] = useState('');
    /*
    const [result, setResult] = useState('');
    const [status, setStatus] = useState('');
    const [statusMsg, setStatusMsg] = useState('');
    */

    const navigate = useNavigate();   
    



    useEffect(() => {
        //const abortController = new AbortController();

        if(call) {
            call = false;
            console.log('Auth')
            axios({
                method: 'post',
                url: REGISTRATION_URL,
                data: {
                    userid: userid
                }
            })
            .then((res) => {
                console.log(res.data)
                alert(res.data.response.status_msg)
                if(res.data.response.result == "allow") {
                    // redirect
                    alert("log in")
                    navigate({
                        pathname: "../../" + role,
                    })
                } else if (res.data.response.result == "deny") {
                    alert("fail")
                    navigate('../..')
                } else { // response is waiting
                    alert("waiting")
                }
            })
            .catch((err) => {
                console.log(err)
                alert("Error authenticating: " + err.response.data)
                navigate('../..')
            }); 
        }       
          
        //return () => { abortController.abort();}
    }, []);



//render() {
    return (
        <>
            <Navbar
            color="dark"
            dark
            >
            <NavbarBrand href="/">
                <img
                alt="NV Logo"
                src={logo}
                style={{
                    height: 60,
                    width: 60
                }}
                />
                Nouveau Health
            </NavbarBrand>
            </Navbar>

            <div style={{margin: "2%"}}>
                <h2>Awaiting Two-Factor Authentication with Duo</h2>
                
                <h3>Loading...</h3>
            </div>
        </>
    );
  }
