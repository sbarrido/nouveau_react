import React from 'react';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {createSearchParams, useNavigate} from 'react-router-dom'
import logo from './../img/Nouveau Health-logos_white.png';
import {Navbar, NavbarBrand, NavbarText, Button, Col, Form, FormGroup, Input, Label, Row, Spinner} from 'reactstrap';
import axios from 'axios';
import Dashboard from '../components/Dashboard';
import { act } from 'react-dom/test-utils';

//let DOCTORPROFILE_URL = "https://nouveau-app.azurewebsites.net/profile/doctor";
let DOCTORPROFILE_URL = "http://localhost:8080/profile/doctor"
export default function DoctorProfile() {
    //const searchParams = new URLSearchParams(window?.location?.search);
    //const userid = parseInt(searchParams.get('userid'));
    const userid = Number(sessionStorage.getItem('userid'))
    const [oldProfile, setOldProfile] = useState({
        doctorid: userid,
        name: null,
        email: null,
        phone: null,
        specialty: null,
        covidsupport: false
    });
    /*
    const [newProfile, setNewProfile] = useState({
        doctorid: userid,
        email: null,
        phone: null,
        specialty: null,
        covidsupport: false
    });
    */
    const [newProfile, setNewProfile] = useState(null);
    const [oldLoading, setOldLoading] = useState(false);
    const [newLoading, setNewLoading] = useState(false);
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
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
            getOldProfile();
        }    
    }, []);
    
    
    const getOldProfile = () => {
        setOldLoading(true);
        axios({
            method: 'post',
            url: DOCTORPROFILE_URL,
            data: {
                doctorid: userid
            }
        })
        .then((response) => {
            setOldProfile(response.data);
            setOldLoading(false);

            delete response.data.feedback
            if(response.data.covidsupport === undefined) {
                response.data.covidsupport = false;
            }
            setNewProfile(response.data)

            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert(error.response.data);
            setOldLoading(false);
        });
    }

    const sendNewProfile = () => {
        setNewLoading(true);
        axios({
            method: 'post',
            url: DOCTORPROFILE_URL + "/update",
            data: {
                doctorid: userid,
                name: newProfile.name,
                email: newProfile.email,
                phone: Number(newProfile.phone),
                specialty: newProfile.specialty,
                covidsupport: newProfile.covidsupport,
                oldPassword: changingPassword ? oldPassword : undefined,
                newPassword: changingPassword ? newPassword : undefined,
            }
        })
        .then((response) => {
            alert('Profile updated successfully')
            sessionStorage.setItem("name", newProfile.name)
            sessionStorage.setItem("email", newProfile.email)
            setOldProfile({
                doctorid: userid,
                name: newProfile.name,
                email: newProfile.email,
                phone: newProfile.phone,
                specialty: newProfile.specialty,
                covidsupport: newProfile.covidsupport
            })
            setNewLoading(false);
            setEditing(false)
            setChangingPassword(false);
            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert(error.response.data);
            setNewLoading(false);
        });
    }


    const cancelClick = (e) => {
        setNewProfile({
            doctorid: userid,
            name: oldProfile.name,
            email: oldProfile.email,
            phone: oldProfile.phone ? oldProfile.phone : '',
            specialty: oldProfile.specialty ? oldProfile.specialty : '',
            covidsupport: oldProfile.covidsupport,
        })
        setNewPassword('')
        setOldPassword('')
        setEditing(false);
        setChangingPassword(false);

    }


    const handleSubmit = (e) => {
        e.preventDefault()
        /*
        alert(newProfile.name)
        alert(newProfile.email)
        alert(newProfile.phone)
        alert(newProfile.specialty)
        alert(newProfile.covidsupport)
        */
        if (newProfile?.email === undefined || newProfile?.email === '' || newProfile?.phone === undefined || newProfile?.phone === '' ||
            newProfile?.specialty === undefined || newProfile?.specialty === '' || newProfile?.covidsupport === undefined || 
            newProfile?.name === undefined || newProfile?.name === '') {
            alert('Please fill out all fields')
            return;
        }
        if (changingPassword && (oldPassword === '' || newPassword === '')) {
            alert('If you are going to change your password you must change your password')
            return;
        }
        if (!/^\d+$/.test(newProfile.phone)) {
            alert('Please enter only numbers for the phone number')
            return;
        }
        sendNewProfile()
        console.log(newProfile)
    }



    return (
        <>
            <Dashboard role='doctor'/>
            <div style={{marginTop: "2%", marginLeft: "5%", marginRight: "5%", display: "block", textAlign: "left"}}>

                <h1 style={{marginLeft: ".5%"}}>Edit Profile</h1>

                <hr/>

                <div style={{marginTop:"25px", width: "75%"}}>
                    <Form onSubmit={handleSubmit} method="post">
                        {
                            oldProfile.specialty === undefined
                            ?
                                <h5>Note: You will not appear available for appointments until you fill out all unfilled profile fields</h5>
                            : null
                        }
                        <div style={{border: "1px solid", borderColor: "black", borderRadius: "15px", height:"100%", padding:"1%", marginBottom: "25px"}}>
                            <div style={{marginBottom:"20px"}}>
                                <Label for="nameid" style={{fontSize:"14pt"}}>Name</Label> <br/>
                                <Input name="name" id="nameid" type="text" 
                                    value={newProfile?.name} 
                                    onChange={(e) => {setNewProfile({
                                        doctorid: userid,
                                        name: e.target.value,
                                        email: newProfile.email,
                                        phone: newProfile.phone,
                                        specialty: newProfile.specialty,
                                        covidsupport: newProfile.covidsupport
                                    })}} 
                                    disabled={!editing}
                                />
                            </div>

                            <div style={{marginBottom:"20px"}}>
                                <Label for="emailid" style={{fontSize:"14pt"}}>Email</Label> <br/>
                                <Input name="email" id="emailid" type="email" 
                                    value={newProfile?.email} 
                                    onChange={(e) => {setNewProfile({
                                        doctorid: userid,
                                        name: newProfile.name,
                                        email: e.target.value,
                                        phone: newProfile.phone,
                                        specialty: newProfile.specialty,
                                        covidsupport: newProfile.covidsupport
                                    })}} 
                                    disabled={!editing}
                                />
                            </div>

                            <div style={{marginBottom:"20px"}}>
                                <Label for="specialtyid" style={{fontSize:"14pt"}}>Specialty</Label> <br/>
                                <Input name="specialty" id="specialtyid" type="text" 
                                    value={newProfile?.specialty} 
                                    onChange={(e) => {setNewProfile({
                                        doctorid: userid,
                                        email: newProfile.email,
                                        name: newProfile.name,
                                        phone: newProfile.phone,
                                        specialty: e.target.value,
                                        covidsupport: newProfile.covidsupport,
                                    })}} 
                                    disabled={!editing}    
                                />
                            </div>

                            <div style={{marginBottom:"20px"}}>
                                <Label for="phoneid" style={{fontSize:"14pt"}}>Phone Number</Label> <br/>
                                <Input name="phone" id="phoneid" type="tel" maxlength="15" minlength="7"
                                    value={newProfile?.phone}
                                    onChange={(e) => {setNewProfile({
                                        doctorid: userid,
                                        name: newProfile.name,
                                        email: newProfile.email,
                                        phone: e.target.value,
                                        specialty: newProfile.specialty,
                                        covidsupport: newProfile.covidsupport,
                                    })}} 
                                    disabled={!editing}    
                                />
                            </div>

                    
                            <div style={{marginBottom:"20px"}}>
                                <Label for="covidid" style={{fontSize:"14pt"}}>Do you support covid care? </Label> <br/>
                                <Input name="covid" id="covidid" type="select" 
                                    onChange={(e) => {setNewProfile({
                                        doctorid: userid,
                                        name: newProfile.name,
                                        email: newProfile.email,
                                        phone: newProfile.phone,
                                        specialty: newProfile.specialty,
                                        covidsupport: !newProfile.covidsupport,
                                    })}}  
                                    value={newProfile?.covidsupport} disabled={!editing}    
                                >
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </Input>
                            </div>
                        </div>

                        <div style={{marginBottom:"20px", display: changingPassword ? 'block' : 'none', border: "1px solid", borderColor: "black", borderRadius: "15px", height:"100%", padding:"1%"}}>
                            <h5>Change Password</h5>
                            <div style={{marginBottom:"10px"}}>
                                <Label for="oldpasswordid" style={{fontSize:"14pt"}}>Old Password</Label> <br/>
                                <Input name="oldpassword" id="oldpasswordid" type="password" 
                                    value={oldPassword} 
                                    onChange={(e) => {setOldPassword(e.target.value)}} 
                                    />
                            </div>

                            <div style={{marginBottom:"10px"}}>
                                <Label for="newpasswordid" style={{fontSize:"14pt"}}>New Password</Label> <br/>
                                <Input name="newpassword" id="newpasswordid" type="password" 
                                    value={newPassword} 
                                    onChange={(e) => {setNewPassword(e.target.value)}} 
                                    />
                            </div>
                        </div>
                        
                        <div>
                            <Button style={{display: !editing ? 'block' : 'none' }} type="button" onClick={(e)=>{setEditing(true)}}>Edit</Button>
                            <div style={{display: editing ? 'block' : 'none' }}>
                                <Button style={{marginRight: "10%"}} type='submit'>Save Profile</Button>
                                <Button style={{marginRight: "10%", display: !changingPassword ? 'inline' : 'none'}} type="button" onClick={(e)=>{setChangingPassword(true)}}>Change Password</Button>
                                <Button style={{marginRight: "10%"}} type="button" onClick={cancelClick}>Cancel</Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
  }
