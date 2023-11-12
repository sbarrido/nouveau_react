import React from 'react';
import {useState, useEffect} from 'react';
import {createSearchParams, Link, useNavigate} from 'react-router-dom'
import {Form, FormGroup, Input, Label, Spinner, Button} from 'reactstrap';
import ReactDOM from 'react-dom/client';
import PatientNav from '../components/PatientNav'
import BookingCalendar from '../components/BookingCalendar'
import axios from 'axios';

//let APPOINTMENT_URL = "https://nouveau-app.azurewebsites.net/appointment";
let APPOINTMENT_URL = "http://localhost:8080/appointment";
export default function Appointment() {
    const searchParams = new URLSearchParams(window?.location?.search);
    const patientid = parseInt(searchParams.get('userid'));
    const doctorid = parseInt(searchParams.get('doctorid'));

    const today = new Date;
    const tomorrow = new Date;
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [unavailableDays, setUnavailableDays] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    var gotAppointments = false;
    const [loading, setLoading] = useState(false);

    // appt info
    const [day, setDay] = useState(tomorrow);
    //const [time, setTime] = useState(null);
    const [covidTest, setCovidTest] = useState(false);
    const [symptoms, setSymptoms] = useState('');

    // covid form
    const [temp, setTemp] = useState(false);
    const [cough, setCough] = useState(false);
    const [breathing, setBreathing] = useState(false);
    const [contact, setContact] = useState(false);
    const [travel, setTravel] = useState(false);

    useEffect(() => {
        if(!gotAppointments) {
            gotAppointments = true;

            getUnavailableDays();

            getAvailableTimes(tomorrow);
        }
    }, []);

    const navigate = useNavigate();

    const getUnavailableDays = () => {
        axios({
            method: 'post',
            url: APPOINTMENT_URL,
            data: {
                date: today,
                doctorid: doctorid
            }
        })
        .then((response) => {
            console.log(response.data);
            setUnavailableDays(response.data);
        }, (error) => {
            console.log(error);
            alert(`Error loading appointments: ${error.message}`);
        });
    }

    const getAvailableTimes = (day) => {
        axios({
            method: 'post',
            url: APPOINTMENT_URL + "/times",
            data: {
                date: day,
                doctorid: doctorid
            }
        })
        .then((response) => {
            console.log(response.data);
            const times = response.data;
            for(let i=0; i<times.length; i++) {
                times[i] = new Date(times[i]);
            }
            console.log(times);
            setAvailableTimes(times);
        }, (error) => {
            console.log(error);
            alert(`Error getting available times: ${error.message}`);
        });
    }

    const bookAppointment = () => {
        axios({
            method: 'post',
            url: APPOINTMENT_URL,
            data: {
                appointment: {
                    date: day,
                    covidtest: covidTest,
                    symptoms: symptoms,
                    doctorid: doctorid,
                    patientid: patientid,
                },
                covidform: {
                    temp: temp,
                    cough: cough,
                    breathing: breathing,
                    contact: contact,
                    travel: travel
                }
            }
        })
        .then((response) => {
            console.log(response.data);
            alert("Appointment successfully created");
        }, (error) => {
            console.log(error);
            alert(`Error booking appointment: ${error.message}`);
        });
    }

    const dayClick = (value, event) => {
        setDay(value);
        getAvailableTimes(value);
        console.log(value);
    }

    const handleSubmit = (event) => {
        if(availableTimes.length===0) {
            alert("No times are available to book an appointment for that day. Please select a different day");
            return;
        }
        bookAppointment();
    }


    return (
        <>
            <PatientNav />
            <div style={{textAlign: "left", width: "95%", marginLeft: "2.50%", marginRight: "2.5%", marginTop: "1%", marginBottom: "2.5%"}}>
                <h2>Book Appointment</h2>
                <div style={{marginTop:"25px", width: "75%"}}>
                    <Form onSubmit={handleSubmit}>
                        <h4>Appointment Information</h4>
                        <div style={{border: "1px solid", borderColor: "black", borderRadius: "15px", height:"100%", padding:"1%", marginBottom: "25px"}}>
                            <div style={{marginBottom:"20px"}}>
                                <Label for="dateid" style={{fontSize:"14pt"}}>Select Date</Label> <br/>
                                <div>
                                    <Input name="date" id="dateid" type="text" value={day.toDateString()} disabled style={{ height:"50px", width:"50%", marginRight: ".5%"}}/>
                                    <div style={{width:"50%", marginRight: "1%", marginTop: "5px"}}>
                                        <BookingCalendar onClickDay={dayClick}></BookingCalendar>
                                    </div>
                                </div>
                            </div>

                            <div style={{marginBottom:"20px"}}>
                                <Label for="timeid" style={{fontSize:"14pt"}}>Select Time</Label> <br/>
                                <Input name="time" id="timeid" type="select" onChange={(e) => {day.setHours(e.target.value)}}>
                                    {availableTimes.length == 0 ? <option value={null}>No times are available for this day</option> : 
                                        availableTimes.map((time, i) => (
                                            <>
                                                <option value={time.getHours()}>{time.toTimeString()}</option>
                                            </>
                                        ))
                                    }
                                </Input>
                            </div>

                            <div style={{marginBottom:"20px"}}>
                                <Label for="symptomid" style={{fontSize:"14pt"}}>Enter Symptoms/Reason for Visit</Label> <br/>
                                <Input name="symptom" id="symptomid" type="text" onChange={(e) => {setSymptoms(e.target.value)}} placeholder="Cough, fever, etc."/>
                            </div>

                            <div style={{marginBottom:"20px"}}>
                                <Label for="covidid" style={{fontSize:"14pt"}}>Would you like to get tested for Covid?</Label> 
                                {//<Input name="covid" id="covidid" type="checkbox" onChange={(e) => setCovidTest(!covidTest)}/>
                                }
                                <br/>
                                <Input name="covid" id="covidid" type="select" onChange={(e) => setCovidTest(e.target.value)} defaultValue={covidTest}>
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </Input>
                            </div>
                        </div> 

                        <h4>Covid Symptom Survey</h4>
                        <div style={{border: "1px solid", borderColor: "black", borderRadius: "15px", height:"100%", padding:"1%", marginBottom:"25px"}}>
                            <div style={{marginBottom:"20px"}}>
                                <Label for="tempid" style={{fontSize:"14pt"}}>Do you have a temperature of 100.4° or higher?</Label> <br/>
                                <Input name="temp" id="tempid" type="select" onChange={(e) => setTemp(e.target.value)} defaultValue={temp}>
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </Input>
                            </div>

                            <div style={{marginBottom:"20px"}}>
                                <Label for="coughid" style={{fontSize:"14pt"}}>Have you had a sore throat or a cough in the past 10 days?</Label> <br/>
                                <Input name="cough" id="coughid" type="select" onChange={(e) => setCough(e.target.value)} defaultValue={cough}>
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </Input>
                            </div>

                            <div style={{marginBottom:"20px"}}>
                                <Label for="breathingid" style={{fontSize:"14pt"}}>Have you experienced shortness of breath or difficulty breathing in the past 10 days?</Label> <br/>
                                <Input name="breathing" id="breathingid" type="select" onChange={(e) => setBreathing(e.target.value)} defaultValue={breathing}>
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </Input>
                            </div>

                            <div style={{marginBottom:"20px"}}>
                                <Label for="contactid" style={{fontSize:"14pt"}}>Have you come in close contact with someone who tested positive for Covid in the past 10 days?</Label> <br/>
                                <Input name="contact" id="contactid" type="select" onChange={(e) => setContact(e.target.value)} defaultValue={contact}>
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </Input>
                            </div>

                            <div style={{marginBottom:"20px"}}>
                                <Label for="travelid" style={{fontSize:"14pt"}}>Have you traveled internationally or to a location with many Covid cases in the past 10 days?</Label> <br/>
                                <Input name="travel" id="travelid" type="select" onChange={(e) => setTravel(e.target.value)} defaultValue={travel}>
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </Input>
                            </div>
                        </div>

                        <Button type='submit'>Book Appointment</Button>
                    </Form>
                </div>
            </div>
        </>
    );
  }
