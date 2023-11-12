import React from 'react';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {createSearchParams, useNavigate} from 'react-router-dom'
import logo from './../img/Nouveau Health-logos_white.png';
import {Navbar, NavbarBrand, NavbarText, Button, Col, Form, FormGroup, Input, Label, Row, Spinner} from 'reactstrap';
import axios from 'axios';
import InsuranceNav from '../components/InsuranceNav'
import { act } from 'react-dom/test-utils';

let INSURANCE_URL = "https://nouveau-app.azurewebsites.net/insurance";
//let INSURANCE_URL = "http://localhost:8080/insurance"
export default function InsuranceDashboard() {
    const searchParams = new URLSearchParams(window?.location?.search);
    const userid = parseInt(searchParams.get('userid'));
    const [plans, setPlans] = useState([]);
    const [patients, setPatients] = useState([]);
    const [patientLoading, setPatientLoading] = useState(false);
    const [plansLoading, setPlansLoading] = useState(false);
    let call = true;

    const navigate = useNavigate();   
    

    useEffect(() => {
        //const abortController = new AbortController();

        if(call) {
            console.log(userid);
            call = false;
            getPatients();
            getPlans();
        }       
          
        //return () => { abortController.abort();}
    }, []);


    const getPatients = () => {
        setPatientLoading(true);
        axios({
            method: 'post',
            url: INSURANCE_URL + "/patients",
            data: {
                providerid: userid
            }
        })
        .then((response) => {
            setPatients(response.data);
            setPatientLoading(false);
            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert(`Error loading patients. Please try again later`);
            setPatientLoading(false);
        });
    }


    const getPlans = () => {
        setPlansLoading(true);
        axios({
            method: 'post',
            url: INSURANCE_URL + "/plans",
            data: {
                providerid: userid
            }
        })
        .then((response) => {
            setPlans(response.data);
            setPlansLoading(false);
            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert(`Error loading plans. Please try again later`);
            setPlansLoading(false);
        });
    }


//render() {
    return (
        <>
            <InsuranceNav />
            <div style={{marginTop: "2%", marginLeft: "5%", marginRight: "5%", display: "block", textAlign: "left"}}>

                <h2 style={{marginLeft: ".5%"}}>Dashboard</h2>

                <hr/>
                
                <div>
                    <h3 style={{marginLeft: ".5%"}}>Insurance Plans</h3>
                    <table style={{tableLayout:"fixed", width:"100%", border: "1px solid"}}>
                        <tbody>
                        {plans.map((plan, i) => (
                        <tr key={i} style={{border: ".75px solid", borderColor: "gray"}}>
                            <td>
                                <div style={{float: "left", width:"49%", marginLeft: ".5%"}}>
                                    <p style={{marginBottom: "0px", fontSize: "16pt"}}>{plan.name} </p>
                                    <p style={{marginBottom: "0px", fontSize: "14pt"}}>${plan.monthlyrate}/mo</p>
                                </div>
                                <div style={{float: "right", width:"49%", textAlign:"right", marginRight: ".5%"}}>
                                    <p style={{marginBottom: "0px", fontSize: "12pt"}}>Deductible: ${plan.deductible} </p>
                                    <p style={{marginBottom: "0px", fontSize: "12pt"}}>Primary Care Copay: ${plan.physiciancopay}</p>
                                    <p style={{marginBottom: "0px", fontSize: "12pt"}}>Pharmacy Copay: ${plan.pharmacopay}</p>
                                </div>
                            </td>
                        </tr>
                        ))}
                        </tbody>
                    </table>
                </div>



                <div>
                    <h3 style={{marginLeft: ".5%"}}> Patients</h3>
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

            </div>
        </>
    );
  }
