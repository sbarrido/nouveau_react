import React from 'react';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {createSearchParams, useNavigate} from 'react-router-dom'
import logo from './../img/Nouveau Health-logos_white.png';
import {Navbar, NavbarBrand, NavbarText, Button, Col, Form, FormGroup, Input, Label, Row, Spinner} from 'reactstrap';
import axios from 'axios';
import Dashboard from '../components/Dashboard';
import { act } from 'react-dom/test-utils';

//let INSURANCE_URL = "https://nouveau-app.azurewebsites.net/patient";
let INSURANCE_URL = "http://localhost:8080/patient"
export default function PatientHome() {
    //const searchParams = new URLSearchParams(window?.location?.search);
    //const userid = parseInt(searchParams.get('userid'));
    const userid = Number(sessionStorage.getItem('userid'))
    const [plan, setPlan] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [doctorsLoading, setDoctorsLoading] = useState(false);
    const [planLoading, setPlanLoading] = useState(false);
    const [upcomingLoading, setUpcomingLoading] = useState(false);
    let call = true;

    const navigate = useNavigate();   
    

    useEffect(() => {
        //const abortController = new AbortController();

        if(call) {
            console.log(userid);
            call = false;
            getDoctors();
            getPlan();
            getUpcoming();
        }       
          
        //return () => { abortController.abort();}
    }, []);


    const getDoctors = () => {
        setDoctorsLoading(true);
        axios({
            method: 'post',
            url: INSURANCE_URL + "/doctors",
            data: {
                patientid: userid
            }
        })
        .then((response) => {
            setDoctors(response.data);
            setDoctorsLoading(false);
            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert(error.response.data);
            setDoctorsLoading(false);
        });
    }


    const getPlan = () => {
        setPlanLoading(true);
        axios({
            method: 'post',
            url: INSURANCE_URL + "/plan",
            data: {
                patientid: userid
            }
        })
        .then((response) => {
            setPlan(response.data);
            setPlanLoading(false);
            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert(error.response.data);
            setPlanLoading(false);
        });
    }


    const getUpcoming = () => {
        setUpcomingLoading(true);
        axios({
            method: 'post',
            url: INSURANCE_URL + "/upcoming",
            data: {
                patientid: userid
            }
        })
        .then((response) => {
            setUpcoming(response.data);
            /*
            for(let i=0; i<upcoming.length; i++) {
                const temp = new Date(upcoming[i].date)
                upcoming[i].date = temp;
            }
            */

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
            <Dashboard role='patient'/>
            <div style={{marginTop: "2%", marginLeft: "5%", marginRight: "5%", display: "block", textAlign: "left"}}>

                <h1 style={{marginLeft: ".5%"}}>Home - {sessionStorage.getItem("name")}</h1>

                <hr/>
                
                <div>
                    <h3 style={{marginLeft: ".5%"}}>My Insurance Plan</h3>
                    {plan === null
                        ?
                            <div style={{width:"100%", border: "1px solid", marginBottom:"25px", overflow:"auto", padding:"1%"}}> 
                                <p>You do not have an insurance plan</p> 
                            </div>
                        :
                            <div style={{width:"100%", border: "1px solid", marginBottom:"25px", overflow:"auto"}}>
                                <div style={{float: "left", width:"49%", marginLeft: ".5%"}}>
                                    <p style={{marginBottom: "0px", fontSize: "16pt"}}>{plan.name} </p>
                                    <p style={{marginBottom: "0px", fontSize: "14pt"}}>${plan.monthlyrate}/mo</p>
                                </div>
                                <div style={{float: "right", width:"49%", textAlign:"right", marginRight: ".5%"}}>
                                    <p style={{marginBottom: "0px", fontSize: "12pt"}}>Deductible: ${plan.deductible} </p>
                                    <p style={{marginBottom: "0px", fontSize: "12pt"}}>Primary Care Copay: ${plan.physiciancopay}</p>
                                    <p style={{marginBottom: "0px", fontSize: "12pt"}}>Pharmacy Copay: ${plan.pharmacopay}</p>
                                </div>
                            </div>
                    }
                </div>

                

                <div>
                    <h3 style={{marginLeft: ".5%"}}>My Doctors</h3>
                    {doctors.length === 0
                    ? 
                        <div style={{width:"100%", border: "1px solid", marginBottom:"25px", overflow:"auto", padding:"1%"}}>
                            <p>You have not had any appointments with doctors yet</p>
                        </div>
                    :
                        <table style={{tableLayout:"fixed", width:"100%", marginBottom:"25px"}}>
                        <tbody>
                            {doctors.map((doctor, i) => (
                            <tr key={i} style={{border: "1px solid"}}>
                                <td>
                                    <div style = {{marginLeft: ".5%"}}>
                                        <p style={{marginBottom: "0px", fontSize: "14pt"}}>Dr. {doctor.name} </p>
                                        <p style={{marginBottom: "0px", fontSize: "12pt"}}>{doctor.specialty} </p>
                                    </div>
                                </td>
                            </tr>
                            ))}
                            </tbody>
                        </table>
                    }
                </div>


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
                                        <p style={{marginBottom: "0px", fontSize: "14pt"}}>Dr. {appt.doctorname} </p>
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
