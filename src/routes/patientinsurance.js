import React from 'react';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {createSearchParams, useNavigate} from 'react-router-dom'
import logo from './../img/Nouveau Health-logos_white.png';
import {Navbar, NavbarBrand, NavbarText, Button, Col, Form, FormGroup, Input, Label, Row, Spinner} from 'reactstrap';
import axios from 'axios';
import Dashboard from '../components/Dashboard';
import { act } from 'react-dom/test-utils';

let INSURANCE_URL = "https://nouveau-app.azurewebsites.net/insurance/patient";
//let INSURANCE_URL = "http://localhost:8080/insurance/patient"
export default function PatientInsurance() {
    //const searchParams = new URLSearchParams(window?.location?.search);
    //const userid = parseInt(searchParams.get('userid'));
    const userid = Number(sessionStorage.getItem('userid'))
    const [plan, setPlan] = useState(null);
    const [allProviders, setAllProviders] = useState([]);
    const [allPlansLoading, setAllPlansLoading] = useState(false);
    const [planLoading, setPlanLoading] = useState(false);
    const [changeLoading, setChangeLoading] = useState(false);
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
            else if(sessionStorage.getItem('role') !== 'patient') {
                alert("You do not have access to this page")
                navigate(`../${sessionStorage.getItem('role')}`)
            }
        }

        if(call) {
            console.log(userid);
            call = false;
            getAllProviders();
            getPlan();
        }       
          
        //return () => { abortController.abort();}
    }, []);


    const getAllProviders = () => {
        setAllPlansLoading(true);
        axios({
            method: 'post',
            url: INSURANCE_URL + "/allPlans",
            data: {
                patientid: userid
            }
        })
        .then((response) => {
            setAllProviders(response.data);
            setAllPlansLoading(false);
            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert(`Error loading plans. Please try again later: ${error.response.data}`);
            setAllPlansLoading(false);
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
            alert("Error loading your plan: " + error.response.data);
            setPlanLoading(false);
        });
    }


    const sendSubscribe = (planid) => {
        setChangeLoading(true);
        axios({
            method: 'post',
            url: INSURANCE_URL + "/subscribe",
            data: {
                patientid: userid,
                planid: planid,
            }
        })
        .then((response) => {
            alert("Subscribed to plan successfully")
            getPlan();
            setChangeLoading(false);
            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert("Error subscribing to this plan: " + error.response.data);
            setChangeLoading(false);
        });
    }


    const sendUnsubscribe = () => {
        setChangeLoading(true);
        axios({
            method: 'post',
            url: INSURANCE_URL + "/unsubscribe",
            data: {
                patientid: userid,
            }
        })
        .then((response) => {
            alert("Unsubscribed from plan successfully")
            getPlan();
            setChangeLoading(false);
            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert(error.response.data);
            setChangeLoading(false);
        });
    }


    const getStyle = (planid) => {
        if(planid === plan?.planid) {
            return {
                border: "1px solid",
                display: "none"
            }
        }

        return {
            border: "1px solid",
        }
    }


    const clickSubscribe = (planid) => {
        let confirmString = plan !== null ? "Are you sure you want to subscribe to this plan? It will replace your current plan" : "Are you sure you want to subscribe to this plan?"
        let res = window.confirm(confirmString);

        if(res) {
            sendSubscribe(planid);
        }
    }


    const clickUnsubscribe = () => {
        let res = window.confirm("Are you sure you want to unsubscribe from this plan?");

        if(res) {
            sendUnsubscribe();
        }
    }
    


//render() {
    return (
        <>
            <Dashboard role='patient'/>
            <div style={{marginTop: "2%", marginLeft: "5%", marginRight: "5%", display: "block", textAlign: "left"}}>

                <h1 style={{marginLeft: ".5%"}}>Insurance Plans</h1>

                <hr/>
                
                <div>
                    <h3 style={{marginLeft: ".5%"}}>Current Plan</h3>
                    {plan === null
                        ?
                            <div style={{width:"100%", border: "1px solid", marginBottom:"25px", overflow:"auto", padding:"1%"}}> 
                                <p>You do not have an insurance plan</p> 
                            </div>
                        :
                            <div style={{width:"100%", border: "1px solid", marginBottom:"25px", overflow:"auto"}}>
                                <div style={{float: "left", width:"39%", marginLeft: ".5%"}}>
                                    <h5 style={{marginBottom: "0px"}}>{plan.providername}</h5>
                                    <p style={{marginBottom: "0px", fontSize: "16pt"}}>{plan.name} </p>
                                    <p style={{marginBottom: "0px", fontSize: "14pt"}}>${plan.monthlyrate}/mo</p>
                                </div>
                                <div style={{float: "left", width:"39%", textAlign:"right", marginRight: ".5%"}}>
                                    <p style={{marginBottom: "0px", fontSize: "12pt"}}>Deductible: ${plan.deductible} </p>
                                    <p style={{marginBottom: "0px", fontSize: "12pt"}}>Primary Care Copay: ${plan.physiciancopay}</p>
                                    <p style={{marginBottom: "0px", fontSize: "12pt"}}>Pharmacy Copay: ${plan.pharmacopay}</p>
                                </div>
                                <div style={{float:"right", width:"19%", textAlign:"center", marginTop:"17px", marginRight:".5%"}}>
                                    <Button onClick={()=>{clickUnsubscribe()}}>Unsubscribe</Button>
                                </div>
                            </div>
                    }
                </div>

                <hr/>

                <div>
                    <h3 style={{marginLeft: ".5%", marginBottom: "15px"}}>Available Plans</h3>

                    {allProviders.length === 0
                    ? 
                        <div style={{width:"100%", marginBottom:"25px", overflow:"auto", padding:"1%"}}>
                            <p style={{fontSize: "16pt"}}>No plans available</p>
                        </div>
                    :
                        <div style={{width:"100%"}}>
                            {allProviders.map((provider, i) => (
                            <div style={{width: "100%"}}>
                            <h5 style={{marginLeft: ".5%"}}>{provider.providername}</h5>
                                {provider.plans.length === 0 ? 
                                    <div style={{width: "100%", marginBottom: "30px", paddingLeft:".5%", border: "1px solid"}}>
                                        <p style={{fontSize:"14pt"}}>No plans available</p>
                                    </div>
                                :
                                <table style={{width: "100%", marginBottom: "30px"}}>
                                    <tbody>
                                        {provider.plans.map((currentplan, j) => (
                                            <tr key={i} style={getStyle(currentplan.planid)}>
                                                <td>
                                                    <div style={{float: "left", width:"39%", marginLeft: ".5%"}}>
                                                        <p style={{marginBottom: "0px", fontSize: "16pt"}}>{currentplan.name} </p>
                                                        <p style={{marginBottom: "0px", fontSize: "14pt"}}>${currentplan.monthlyrate}/mo</p>
                                                    </div>
                                                    <div style={{float: "left", width:"39%", textAlign:"right", marginRight: ".5%"}}>
                                                        <p style={{marginBottom: "0px", fontSize: "12pt"}}>Deductible: ${currentplan.deductible} </p>
                                                        <p style={{marginBottom: "0px", fontSize: "12pt"}}>Primary Care Copay: ${currentplan.physiciancopay}</p>
                                                        <p style={{marginBottom: "0px", fontSize: "12pt"}}>Pharmacy Copay: ${currentplan.pharmacopay}</p>
                                                    </div>
                                                    <div style={{float:"right", width:"19%", textAlign:"center", marginTop:"17px", marginRight:".5%"}}>
                                                        <Button onClick={()=>{clickSubscribe(currentplan.planid)}}>Subscribe</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table> 
                                }
                            </div>
                            ))}
                        </div>
                    }
                </div>

            </div>
        </>
    );
  }
