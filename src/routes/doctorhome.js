import React from 'react';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {createSearchParams, useNavigate} from 'react-router-dom'
import logo from './../img/Nouveau Health-logos_white.png';
import {Navbar, NavbarBrand, NavbarText, Button, Col, Form, FormGroup, Input, Label, Row, Spinner} from 'reactstrap';
import axios from 'axios';
import Dashboard from '../components/Dashboard';
import { act } from 'react-dom/test-utils';

//let INSURANCE_URL = "https://nouveau-app.azurewebsites.net/doctor";
let INSURANCE_URL = "http://localhost:8080/doctor"
export default function DoctorHome() {
    //const searchParams = new URLSearchParams(window?.location?.search);
    //const userid = parseInt(searchParams.get('userid'));
    const userid = Number(sessionStorage.getItem('userid'))
    const [upcoming, setUpcoming] = useState([]);
    const [patients, setPatients] = useState([]);
    const [patientLoading, setPatientLoading] = useState(false);
    const [upcomingLoading, setUpcomingLoading] = useState(false);
    let call = true;
    let firstload = true;

    const navigate = useNavigate();   
    

    useEffect(() => {
        //const abortController = new AbortController();
        if(firstload) {
            firstload = false;
            if(sessionStorage.getItem('userid') === null) {
                alert("You need to log in to access this page")
                sessionStorage.clear()
                navigate("../")
            }
            else if(sessionStorage.getItem('role') !== 'doctor') {
                alert("You do not have access to this page")
                navigate(`../${sessionStorage.getItem('role')}`)
            }
        }


        if(call) {
            console.log(userid);
            call = false;
            //getPatients();
            getUpcoming();
        }       
          
        //return () => { abortController.abort();}
    }, []);

/*
    const getPatients = () => {
        setPatientLoading(true);
        axios({
            method: 'post',
            url: INSURANCE_URL + "/patients",
            data: {
                doctorid: userid
            }
        })
        .then((response) => {
            setPatients(response.data);
            setPatientLoading(false);
            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert(error.response.data);
            setPatientLoading(false);
        });
    }
    */


    const getUpcoming = () => {
        setUpcomingLoading(true);
        axios({
            method: 'post',
            url: INSURANCE_URL + "/upcoming",
            data: {
                doctorid: userid
            }
        })
        .then((response) => {
            setUpcoming(response.data);
            setUpcomingLoading(false);
            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert(error.response.data);
            setUpcomingLoading(false);
        });
    }


    const createTimeString = (time) => {
        let hour = (new Date(time)).getHours();
        let ampm = "AM";
        if(hour > 11) {
            ampm = "PM"
        }
        if(hour > 12) {
            hour -= 12;
        }

        return `${hour}:00 ${ampm} - ${hour}:45 ${ampm}`;
    }


//render() {
    return (
        <>
            <Dashboard role='doctor'/>
            <div style={{marginTop: "2%", marginLeft: "5%", marginRight: "5%", display: "block", textAlign: "left"}}>

                <h1 style={{marginLeft: ".5%"}}>Home - {sessionStorage.getItem("name")}</h1>

                <hr/>
                


                { /*                
                <div>
                    <h3 style={{marginLeft: ".5%"}}>My Patients</h3>
                    <table style={{tableLayout:"fixed", width:"100%"}}>
                    <tbody>
                        {patients.map((patient, i) => (
                        <tr key={i} style={{border: "1px solid"}}>
                            <td>
                                <div style = {{marginLeft: ".5%"}}>
                                    <p style={{marginBottom: "0px", fontSize: "16pt"}}>{patient.patientname} </p>
                                    <p style={{marginBottom: "0px", fontSize: "14pt"}}>{patient.planname} </p>
                                </div>
                            </td>
                        </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                */}

                <div>
                    <h3 style={{marginLeft: ".5%"}}>Upcoming Appointments</h3>
                        {upcoming.length === 0
                        ? 
                            <div style={{width:"100%", border: "1px solid", marginBottom:"25px", overflow:"auto", padding:"1%"}}>
                                <p>No upcoming appointments</p>
                            </div>
                        :
                            <table style={{tableLayout:"fixed", width:"100%", border: "1px solid", marginBottom:"25px"}}>
                                <tbody>
                                {upcoming.map((appt, i) => (
                                <tr key={i} style={{border: ".75px solid", borderColor: "gray"}}>
                                    <td>
                                        <div style={{float: "left", width:"49%", marginLeft: ".5%"}}>
                                            <p style={{marginBottom: "0px", fontSize: "16pt"}}>{(new Date(appt.date)).toDateString()} </p>
                                            <p style={{marginBottom: "0px", fontSize: "14pt"}}>{createTimeString(appt.date)}</p>
                                        </div>
                                        <div style={{float: "right", width:"49%", textAlign:"right", marginRight: ".5%"}}>
                                            <p style={{marginBottom: "0px", fontSize: "14pt"}}>{appt.patientname} </p>
                                            <p style={{marginBottom: "0px", fontSize: "12pt"}}>Reason: {appt.symptoms}</p>
                                        </div>
                                    </td>
                                </tr>
                                ))}
                                </tbody>
                            </table>
                        }
                </div>
            </div>
        </>
    );
  }
