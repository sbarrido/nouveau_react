import React from 'react';
import {useState, useEffect} from 'react';
import {createSearchParams, Link, useNavigate} from 'react-router-dom'
import {Form, Label, Spinner, Button} from 'reactstrap';
import ReactDOM from 'react-dom/client';
import PatientNav from '../components/PatientNav'
import BookingCalendar from '../components/BookingCalendar'
import axios from 'axios';

//let SEARCH_URL = "https://nouveau-app.azurewebsites.net/appointment";
let SEARCH_URL = "http://localhost:8080/appointment";
export default function Appointment() {
    const searchParams = new URLSearchParams(window?.location?.search);
    const patientid = searchParams.get('userid');
    const doctorid = searchParams.get('doctorid');
    const [unavailableDays, setUnavailableDays] = useState([]);
    const [loading, setLoading] = useState(false);
    var gotAppointments = false;

    useEffect(() => {

    }, []);

    const navigate = useNavigate();

    const dayClick = (value, event) => {
        console.log(value);
    }


    return (
        <>
            <PatientNav />
            <div style={{textAlign: "center", width: "60%", marginLeft: "20%", marginRight: "20%", marginTop: "1%", marginBottom: "2.5%"}}>
                <h2>Book Appointment</h2>
                <div style={{marginTop:"25px"}}>
                    <BookingCalendar onClickDay={dayClick}></BookingCalendar>
                </div>
            </div>
        </>
    );
  }
