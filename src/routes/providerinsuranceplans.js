import React from 'react';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {createSearchParams, useNavigate} from 'react-router-dom'
import logo from './../img/Nouveau Health-logos_white.png';
import {Navbar, NavbarBrand, NavbarText, Button, Col, Form, FormGroup, Input, Label, Row, Spinner} from 'reactstrap';
import axios from 'axios';
import InsuranceNav from '../components/InsuranceNav'
import Dashboard from '../components/Dashboard';
import { act } from 'react-dom/test-utils';

let INSURANCE_URL = "https://nouveau-app.azurewebsites.net/insurance";
//let INSURANCE_URL = "http://localhost:8080/insurance"
export default function InsurancePlans() {
    //const searchParams = new URLSearchParams(window?.location?.search);
    //const userid = parseInt(searchParams.get('userid'));
    const userid = Number(sessionStorage.getItem('userid'))
    const [plans, setPlans] = useState([]);
    const [name, setName] = useState('');
    const [monthlyrate, setMonthlyrate] = useState(0);
    const [deductible, setDeductible] = useState(0);
    const [physiciancopay, setPhysiciancopay] = useState(0);
    const [pharmacopay, setPharmacopay] = useState(0);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [plansLoading, setPlansLoading] = useState(false);
    //const [creating, setCreating] = useState(false);
    //const [editing, setEditing] = useState(false);
    const [idChanged, setIdChanged] = useState(-5)
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
            else if(sessionStorage.getItem('role') !== 'insurance') {
                alert("You do not have access to this page")
                navigate(`../${sessionStorage.getItem('role')}`)
            }
        }

        if(call) {
            console.log(userid);
            call = false;
            getPlans();
        }       
          
        //return () => { abortController.abort();}
    }, []);


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


    const sendNew = () => {
        setUpdateLoading(true);
        axios({
            method: 'post',
            url: INSURANCE_URL + "/provider/new",
            data: {
                providerid: userid,
                name: name,
                monthlyrate: Number(monthlyrate),
                deductible: Number(deductible),
                physiciancopay: Number(physiciancopay),
                pharmacopay: Number(pharmacopay),
            }
        })
        .then((response) => {
            alert("Plan created successfully")
            getPlans();
            clickCancel();
            setUpdateLoading(false);
            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert("Error creating plan: " + error.response.data);
            setUpdateLoading(false);
        });
    }


    const sendUpdate = () => {
        setUpdateLoading(true);
        axios({
            method: 'post',
            url: INSURANCE_URL + "/provider/update",
            data: {
                providerid: userid,
                planid: idChanged,
                name: name,
                monthlyrate: Number(monthlyrate),
                deductible: Number(deductible),
                physiciancopay: Number(physiciancopay),
                pharmacopay: Number(pharmacopay),
            }
        })
        .then((response) => {
            alert("Plan updated successfully")
            getPlans();
            clickCancel();
            setUpdateLoading(false);
            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert(error.response.data);
            setUpdateLoading(false);
        });
    }


    const sendDelete = (planid) => {
        setUpdateLoading(true);
        axios({
            method: 'post',
            url: INSURANCE_URL + "/provider/delete",
            data: {
                providerid: userid,
                planid: planid,
            }
        })
        .then((response) => {
            alert("Plan deleted successfully")
            getPlans();
            setUpdateLoading(false);
            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert(error.response.data);
            setUpdateLoading(false);
        });
    }



    const clickDelete = (planid) => {
        if(window.confirm("Are you sure you want to delete this plan?")) {
            sendDelete(planid)
        }
    }


    const clickCancel = () => {
        setIdChanged(-5);
        setName('');
        setMonthlyrate(0);
        setDeductible(0);
        setPhysiciancopay(0);
        setPharmacopay(0);
    }


    const clickSave = () => {
        /*
        alert(idChanged)
        alert(name)
        alert(Number(monthlyrate))
        alert(deductible)
        alert(physiciancopay)
        alert(pharmacopay)
        */
        if (name === '' || monthlyrate === '' || deductible === '' || physiciancopay === '' || pharmacopay === '') {
            alert('Please fill out all fields')
            return;
        }
        if (Number(monthlyrate) === NaN || Number(monthlyrate) < 0 || Number(deductible) === NaN || Number(deductible) < 0 || 
            Number(physiciancopay) === NaN || Number(physiciancopay) < 0 || Number(pharmacopay) === NaN || Number(pharmacopay) < 0) {
            alert('Please enter valid numbers only')
            return;
        }

        if (idChanged === -1) {
            sendNew();
            return;
        } else if (idChanged > -1) {
            sendUpdate();
            return;
        }
    }


//render() {
    return (
        <>
            <Dashboard role='insurance'/>
            <div style={{marginTop: "2%", marginLeft: "5%", marginRight: "5%", display: "block", textAlign: "left"}}>

                <h1 style={{marginLeft: ".5%"}}>My Insurance Plans</h1>

                <hr/>
                
                <div>
                    {plans.length === 0
                    ? 
                        <div style={{width:"100%", border: "1px solid", marginBottom:"25px", overflow:"auto", padding:"1%"}}>
                            <p>You do not have any insurance plans</p>
                        </div>
                    :
                        <div style={{width:"100%"}}>
                            {plans.map((plan, i) => (
                            <div style={{width:"100%", marginBottom: "40px"}}>
                                <div key={i} style={{border: "1px solid", borderColor: "black", overflow:"auto", marginBottom:"10px", borderRadius: "15px", width: "100%"}}>
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

                                <div style={{marginBottom:"10px", display: idChanged === plan.planid ? 'block' : 'none', border: "1px solid", borderColor: "black", borderRadius: "15px", height:"100%", padding:"1%"}}>
                                    <h5>Edit {plan.name}</h5>
                                    <div style={{marginBottom:"10px"}}>
                                        <Label for="nameid" style={{fontSize:"14pt"}}>Plan name</Label> <br/>
                                        <Input name="name" id="nameid" type="text" value={name} onChange={(e) => {setName(e.target.value)}} />
                                    </div>

                                    <div style={{marginBottom:"10px"}}>
                                        <Label for="rateid" style={{fontSize:"14pt"}}>Monthly rate</Label> <br/>
                                        <Input name="rate" id="rateid" type="number" value={monthlyrate} onChange={(e) => {setMonthlyrate(e.target.value)}} />
                                    </div>

                                    <div style={{marginBottom:"10px"}}>
                                        <Label for="deductibleid" style={{fontSize:"14pt"}}>Deductible</Label> <br/>
                                        <Input name="deductible" id="deductibleid" type="number" value={deductible} onChange={(e) => {setDeductible(e.target.value)}} />
                                    </div>

                                    <div style={{marginBottom:"10px"}}>
                                        <Label for="primcopid" style={{fontSize:"14pt"}}>Primary Care Copay</Label> <br/>
                                        <Input name="primcop" id="primcopid" type="number" value={physiciancopay} onChange={(e) => {setPhysiciancopay(e.target.value)}} />
                                    </div>
                                    <div style={{marginBottom:"10px"}}>
                                        <Label for="pharmcopid" style={{fontSize:"14pt"}}>Pharmacy Copay</Label> <br/>
                                        <Input name="pharmcop" id="pharmcopid" type="number" value={pharmacopay} onChange={(e) => {setPharmacopay(e.target.value)}} />
                                    </div>
                                </div>

                                <div style={{marginLeft: ".5%", marginBottom: ".5%", display:'block'}}>
                                    <Button style={{marginRight: "1%", display: idChanged < -1 ? 'inline' : 'none'}} type='button' onClick={()=>{setIdChanged(plan.planid)}}>Edit</Button>
                                    <Button style={{marginRight: "1%", display: idChanged < -1 ? 'inline' : 'none'}} type='button' onClick={()=>{clickDelete(plan.planid)}}>Delete</Button>
                                    <Button style={{marginRight: "1%", display: idChanged === plan.planid ? 'inline' : 'none'}} type="button" onClick={(e)=>{clickSave()}}>Save Plan</Button>
                                    <Button style={{marginRight: "1%", display: idChanged === plan.planid ? 'inline' : 'none'}} type="button" onClick={(e)=>{clickCancel()}}>Cancel</Button>
                                </div>
                            </div>
                            ))}
                        </div>
                    }
                </div>

                <hr/>

                <div style={{width:"100%"}}>
                    <div style={{marginBottom:"10px", display: idChanged === -1 ? 'block' : 'none', border: "1px solid", borderColor: "black", borderRadius: "15px", height:"100%", padding:"1%"}}>
                        <h5>Create new plan</h5>
                        <div style={{marginBottom:"10px"}}>
                            <Label for="nameid" style={{fontSize:"14pt"}}>Plan name</Label> <br/>
                            <Input name="name" id="nameid" type="text" value={name} onChange={(e) => {setName(e.target.value)}} />
                        </div>

                        <div style={{marginBottom:"10px"}}>
                            <Label for="rateid" style={{fontSize:"14pt"}}>Monthly rate</Label> <br/>
                            <Input name="rate" id="rateid" type="number" value={monthlyrate} onChange={(e) => {setMonthlyrate(e.target.value)}} />
                        </div>

                        <div style={{marginBottom:"10px"}}>
                            <Label for="deductibleid" style={{fontSize:"14pt"}}>Deductible</Label> <br/>
                            <Input name="deductible" id="deductibleid" type="number" value={deductible} onChange={(e) => {setDeductible(e.target.value)}} />
                        </div>

                        <div style={{marginBottom:"10px"}}>
                            <Label for="primcopid" style={{fontSize:"14pt"}}>Primary Care Copay</Label> <br/>
                            <Input name="primcop" id="primcopid" type="number" value={physiciancopay} onChange={(e) => {setPhysiciancopay(e.target.value)}} />
                        </div>
                        <div style={{marginBottom:"10px"}}>
                            <Label for="pharmcopid" style={{fontSize:"14pt"}}>Pharmacy Copay</Label> <br/>
                            <Input name="pharmcop" id="pharmcopid" type="number" value={pharmacopay} onChange={(e) => {setPharmacopay(e.target.value)}} />
                        </div>
                    </div>

                    <div style={{marginLeft: ".5%", marginBottom: ".5%", display:'block'}}>
                        <Button style={{marginRight: "1%", display: idChanged < -1 ? 'inline' : 'none'}} type='button' onClick={()=>{setIdChanged(-1)}}>Create New Plan</Button>
                        <Button style={{marginRight: "1%", display: idChanged === -1 ? 'inline' : 'none'}} type="button" onClick={(e)=>{clickSave()}}>Save Plan</Button>
                        <Button style={{marginRight: "1%", display: idChanged === -1 ? 'inline' : 'none'}} type="button" onClick={(e)=>{clickCancel()}}>Cancel</Button>
                    </div>
                </div>
            </div>
        </>
    );
  }



