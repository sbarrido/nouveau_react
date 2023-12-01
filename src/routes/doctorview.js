import React from 'react';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {createSearchParams, useNavigate} from 'react-router-dom'
import logo from './../img/Nouveau Health-logos_white.png';
import {Navbar, NavbarBrand, NavbarText, Button, Col, Form, FormGroup, Input, Label, Row, Spinner} from 'reactstrap';
import axios from 'axios';
import Dashboard from '../components/Dashboard';
import { act } from 'react-dom/test-utils';

let DOCTORVIEW_URL = "https://nouveau-app.azurewebsites.net/doctor";
//let DOCTORVIEW_URL = "http://localhost:8080/doctor"
export default function DoctorView() {
    //const searchParams = new URLSearchParams(window?.location?.search);
    //const userid = parseInt(searchParams.get('userid'));
    const userid = Number(sessionStorage.getItem('userid'))
    const doctorid = Number(sessionStorage.getItem('doctorviewid'))
    const [allFeedback, setAllFeedback] = useState([]);
    const [profile, setProfile] = useState(null);
    const [isPatient, setIsPatient] = useState(false);
    const [rating, setRating] = useState(1);
    const [written, setWritten] = useState('');
    const [writingFeedback, setWritingFeedback] = useState(null)
    const [givenFeedback, setGivenFeedback] = useState(false)
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
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
            else if(sessionStorage.getItem('doctorviewid') === null) {
                alert("No doctor is selected. Returning to home...");
                navigate('/patient')
            }
        }


        if(call) {
            console.log(userid);
            call = false;
            getDetails();
        }       
          
    }, []);


    const getDetails = () => {
        setDetailsLoading(true);
        axios({
            method: 'post',
            url: DOCTORVIEW_URL + "/details",
            data: {
                patientid: userid,
                doctorid: doctorid
            }
        })
        .then((response) => {
            setAllFeedback(response.data.feedback);
            setProfile(response.data.doctor);
            setIsPatient(response.data.isPatient);
            setGivenFeedback(response.data.hasGivenFeedback);
            setDetailsLoading(false);
            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert(error.response.data);
            setDetailsLoading(false);
        });
    }


    const postFeedback = () => {
        setFeedbackLoading(true);
        axios({
            method: 'post',
            url: DOCTORVIEW_URL + "/feedback",
            data: {
                patientid: userid,
                doctorid: doctorid,
                rating: Number(rating),
                written: written === null || written.trim() === '' ? undefined : written.trim()
            }
        })
        .then((response) => {
            alert('Feedback submitted')
            getDetails();
            setWritingFeedback(false);
            setFeedbackLoading(false);
            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert(error.response.data);
            setFeedbackLoading(false);
        });
    }


    const phoneNumberify = (phoneNumber) => {
        if(phoneNumber === undefined || phoneNumber === null) {
            return null;
        }

        let stringNum = phoneNumber.toString()

        if (stringNum.length !== 10) {
            return stringNum
        }

        let outNum = stringNum.substring(0, 3) + "-" + stringNum.substring(3, 6) + "-" + stringNum.substring(6)
        return outNum;
    }

    const appointmentRedirect = () => {

        sessionStorage.setItem('apptdoctorid', doctorid)
        sessionStorage.setItem('apptdoctorname', profile?.name)
        navigate("/appointment")
    }

    const cancelClick = (e) => {
        setRating(1)
        setWritten('');
        setWritingFeedback(false);
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        postFeedback()
        console.log(rating)
        console.log(written)
    }


//render() {
    return (
        <>
            <Dashboard role='patient'/>
            <div style={{marginTop: "2%", marginLeft: "5%", marginRight: "5%", display: "block", textAlign: "left"}}>

                <div style={{marginLeft: ".5%", marginBottom: "30px"}}>
                    <h1>Dr. {profile?.name}</h1>
                    <div style={{display: 'block', marginBottom:"20px"}}>
                        <h3 style={{display: 'inline', marginRight: "5%"}}>{profile?.specialty}</h3>
                        <h5 style={{display: 'inline'}}>{profile?.covid ? "Supports Covid Care" : "Does not support Covid Care"}</h5>
                    </div>

                    <div style={{marginBottom:"20px"}}>
                        <h4>Contact Info</h4>
                        <p style={{fontSize: "16pt", marginBottom: "0px"}}>Email: {profile?.email}</p>
                        <p style={{fontSize: "16pt"}}>Phone Number: {phoneNumberify(profile?.email)}</p>
                    </div>

                    <div>
                        <Button onClick={() => {appointmentRedirect()}}>Book Appointment</Button>
                    </div>
                </div>

                <div>
                    <h4 style={{marginLeft: ".5%"}}>Reviews</h4>
                    <h5 style={{marginLeft: ".5%"}}>Average Rating: {profile?.feedback} {allFeedback.length > 0 ? '⭐' : null}</h5>
                        {allFeedback.length === 0
                        ?
                            <div style={{width:"100%", border: "1px solid", marginBottom:"25px", overflow:"auto", padding:"1%"}}>
                                <p>No Feedback</p>
                            </div>
                        :
                            <table style={{tableLayout:"fixed", width:"100%", border: "1px solid", marginBottom:"25px"}}>
                                <tbody>
                                {allFeedback.map((review, i) => (
                                <tr key={i} style={{border: ".75px solid", borderColor: "gray"}}>
                                    <td>
                                        <div>
                                            <p style={{marginBottom: "10px", marginLeft: ".5%", fontSize: "16pt"}}>{review.rating}/5⭐ </p>
                                            <p style={{marginBottom: "0px", marginLeft: ".5%", fontSize: "14pt", display: review.written ? "inline" : "none"}}>{review.written}</p>
                                        </div>
                                    </td>
                                </tr>
                                ))}
                                </tbody>
                            </table>
                        }
                </div>

                <Button style={{display: isPatient && !writingFeedback ? 'block' : 'none' }} type="button" onClick={(e)=>{setWritingFeedback(true)}}>
                    {givenFeedback ? "Leave new review" : "Leave review"}
                </Button>

                <Form onSubmit={handleSubmit} method="post">
                    <div style={{marginBottom:"20px", display: writingFeedback ? 'block' : 'none', border: "1px solid", borderColor: "black", borderRadius: "15px", height:"100%", padding:"1%"}}>
                            <h4>Leave Review</h4>
                            <p style={{display: givenFeedback ? 'block' : 'none'}}>Note: Your new feedback will overwrite your old review</p>
                            <div style={{marginBottom:"10px"}}>
                                <Label for="ratingid" style={{fontSize:"14pt"}}>Rating</Label> <br/>
                                <div>
                                    <Input type="text" disabled value={rating} style={{width:"10%", display: "inline", marginRight: "1%"}}/>
                                    <Input name="rating" id="ratingid" type="range" min="1" max="5" step="1" style={{width:"50%", display: "inline"}}
                                        value={rating} 
                                        onChange={(e) => {setRating(e.target.value)}} 
                                    />
                                </div>
                            </div>

                            <div style={{marginBottom:"10px"}}>
                                <Label for="writtenid" style={{fontSize:"14pt"}}>Additional Comments</Label> <br/>
                                <Input name="written" id="written" type="text" 
                                    value={written} 
                                    onChange={(e) => {setWritten(e.target.value)}} 
                                />
                            </div>
                        </div>
                        
                        <div>
                            <div style={{display: writingFeedback ? 'block' : 'none' }}>
                                <Button style={{marginRight: "10%"}} type='submit'>Submit feedback</Button>
                                <Button style={{marginRight: "10%"}} type="button" onClick={cancelClick}>Cancel</Button>
                            </div>
                        </div>
                </Form>
            </div>
        </>
    );
  }
