import React from 'react';
import {useState, useEffect} from 'react';
import {createSearchParams, Link, useNavigate} from 'react-router-dom'
import {Form, Label, Spinner, Button} from 'reactstrap';
import ReactDOM from 'react-dom/client';
import PatientNav from '../components/PatientNav'
import axios from 'axios';

//let SEARCH_URL = "https://nouveau-app.azurewebsites.net/appointment";
let SEARCH_URL = "http://localhost:8080/appointment";
export default function Booking() {
    const searchParams = new URLSearchParams(window?.location?.search);
    const patientid = searchParams.get('userid');
    const doctorid = searchParams.get('doctorid');
    const [unavailableDays, setUnavailableDays] = useState([]);
    const [loading, setLoading] = useState(false);
    var gotAppointments = false;


    useEffect(() => {

    }, []);
}