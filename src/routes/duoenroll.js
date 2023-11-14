import React from 'react';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {createSearchParams, useNavigate} from 'react-router-dom'
import logo from './../img/Nouveau Health-logos_white.png';
import {Navbar, NavbarBrand, NavbarText, Button, Col, Form, FormGroup, Input, Label, Row, Spinner} from 'reactstrap';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

let REGISTRATION_URL = "https://nouveau-app.azurewebsites.net/registration";
//let REGISTRATION_URL = "http://localhost:8080/registration"
export default function DuoEnroll() {
    const searchParams = new URLSearchParams(window?.location?.search);
    const userid = searchParams.get('userid')
    const [loading, setLoading] = useState(true);
    let call = true
    //const [userid, setUserid] = useState('');
    const [duoid, setDuoid] = useState('');
    const [barcodeURL, setBarcodeURL] = useState('');
    const [activationURL, setActivationURL] = useState('');
    const [activationCode, setActivationCode] = useState('');
    
    useEffect(() => {
        //const abortController = new AbortController();

        if(call) {
            call = false;
            axios({
                method: 'post',
                url: REGISTRATION_URL + "/enroll",
                data: {
                    userid: userid
                }
            })
            .then((res) => {
                console.log(res.data)
                setDuoid(res.data.response.user_id);
                setBarcodeURL(res.data.response.activation_barcode);
                setActivationCode(res.data.response.activation_code);
                setActivationURL(res.data.response.activation_url);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e)
                setDuoid('ERROR');
                setLoading(false);
            }); 
        }       
          
        //return () => { abortController.abort();}
    }, []);

    const navigate = useNavigate();

    const handleDone = async (event) => {
        // check if the user has enrolled
        axios({
            method: 'post',
            url: REGISTRATION_URL + '/enroll/status',
            data: {
                user_id: duoid,
                activation_code: activationCode 
            }
        })
        .then((res) => {
            console.log(res.data)
            if(res.data.response == "success") {
                alert("Successfully Enrolled")
                navigate("../..")
            } else if(res.data.response == "waiting") {
                alert("Waiting on Duo Enrollment. Please enroll or cancel")
            } else {
                alert('Enrollment link expired. Please enroll at a later time')
                handleCancel(null);
            }
        })
        .catch((e) => {
            console.log(e)
            alert("Error determining enroll status. Please enroll at a later time")
            handleCancel(null);
        });
    }

    const handleCancel = async (event) => {
        // set user's mfa status to false so that they can set it up after logging in
        axios({
            method: 'post',
            url: REGISTRATION_URL + '/mfa',
            data: {
                userid: userid,
            }
        })
        .then((res) => {
            alert("2FA Enrollment cancelled. If you change your mind, you can enroll from profile settings")
            navigate("../..")
        })
        .catch((e) => {
            console.log(e)
            alert("Error cancelling 2FA enrollment")
            navigate("../..")
        });
    }

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
                <h2>Enroll in Two-Factor Authentication with Duo </h2>
                
                {loading ? <Spinner /> : 
                    <>
                        <h3>If you are on a mobile device, download the Duo App and use the link or activation code below to enroll</h3>
                        <iframe src={activationURL} style={{width: "100%", height: "400px"}}/>
                        <br/> <br/>

                        <h3>If you are not on a mobile device, download the Duo App on your phone and scan the QR code below</h3>
                        <img src={barcodeURL}/> 
                        <br/>

                        <div style={{display: "flex"}}>
                            <Button onClick={handleCancel} style={{marginLeft: "5%", marginRight: "40%"}}>Cancel Enrollment</Button>
                            <Button onClick={handleDone} style={{marginLeft: "40%", marginRight: "5%"}}>Done</Button>
                        </div>
                    </>
                }
            </div>
        </>
    );
  }
