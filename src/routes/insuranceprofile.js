import React from 'react';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {createSearchParams, useNavigate} from 'react-router-dom'
import logo from './../img/Nouveau Health-logos_white.png';
import {Navbar, NavbarBrand, NavbarText, Button, Col, Form, FormGroup, Input, Label, Row, Spinner} from 'reactstrap';
import axios from 'axios';
import Dashboard from '../components/Dashboard';
import { act } from 'react-dom/test-utils';

//let INSURANCEPROFILE_URL = "https://nouveau-app.azurewebsites.net/profile/insurance";
let INSURANCEPROFILE_URL = "http://localhost:8080/profile/insurance"
export default function InsuranceProfile() {
    //const searchParams = new URLSearchParams(window?.location?.search);
    //const userid = parseInt(searchParams.get('userid'));
    const userid = Number(sessionStorage.getItem('userid'))
    const [oldProfile, setOldProfile] = useState({
        userid: userid,
        name: sessionStorage.getItem('name'),
        email: sessionStorage.getItem('email'),
    });
    const [newProfile, setNewProfile] = useState({
        userid: userid,
        name: sessionStorage.getItem('name'),
        email: sessionStorage.getItem('email'),
    });
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
            else if(sessionStorage.getItem('role') !== 'insurance') {
                alert("You do not have access to this page")
                navigate(`../${sessionStorage.getItem('role')}`)
            }
        }

        /*
        if(call) {
            console.log(userid);
            call = false;
            //getOldProfile();
        }  
        */  
    }, []);
    
    /*
    const getOldProfile = () => {
        setOldLoading(true);
        axios({
            method: 'post',
            url: INSURANCEPROFILE_URL,
            data: {
                userid: userid
            }
        })
        .then((response) => {
            setOldProfile(response.data);
            setOldLoading(false);

            setNewProfile(response.data)

            console.log(response.data);
        }, (error) => {
            console.log(error);
            alert(error.response.data);
            setOldLoading(false);
        });
    }
    */


    const sendNewProfile = () => {
        setNewLoading(true);
        axios({
            method: 'post',
            url: INSURANCEPROFILE_URL + "/update",
            data: {
                userid: userid,
                name: newProfile.name,
                email: newProfile.email,
                oldPassword: changingPassword ? oldPassword : undefined,
                newPassword: changingPassword ? newPassword : undefined,
            }
        })
        .then((response) => {
            alert('Profile updated successfully')
            sessionStorage.setItem("name", newProfile.name)
            sessionStorage.setItem("email", newProfile.email)
            setOldProfile({
                userid: userid,
                name: newProfile.name,
                email: newProfile.email,
            })
            setNewPassword('')
            setOldPassword('')
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
            userid: userid,
            name: oldProfile.name,
            email: oldProfile.email,
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
        if (newProfile?.email === undefined || newProfile?.email === '' || newProfile?.name === undefined || newProfile?.name === '') {
            alert('Please fill out all fields')
            return;
        }
        if (changingPassword && (oldPassword === '' || newPassword === '')) {
            alert('If you are going to change your password you must change your password')
            return;
        }
        sendNewProfile()
        console.log(newProfile)
    }



    return (
        <>
            <Dashboard role='insurance'/>
            <div style={{marginTop: "2%", marginLeft: "5%", marginRight: "5%", display: "block", textAlign: "left"}}>

                <h1 style={{marginLeft: ".5%"}}>Edit Profile</h1>

                <hr/>

                <div style={{marginTop:"25px", width: "75%"}}>
                    <Form onSubmit={handleSubmit} method="post">
                        <div style={{border: "1px solid", borderColor: "black", borderRadius: "15px", height:"100%", padding:"1%", marginBottom: "25px"}}>
                            <div style={{marginBottom:"20px"}}>
                                <Label for="nameid" style={{fontSize:"14pt"}}>Name</Label> <br/>
                                <Input name="name" id="nameid" type="text" 
                                    value={newProfile?.name} 
                                    onChange={(e) => {setNewProfile({
                                        userid: userid,
                                        name: e.target.value,
                                        email: newProfile.email,
                                    })}} 
                                    disabled={!editing}
                                />
                            </div>

                            <div style={{marginBottom:"20px"}}>
                                <Label for="emailid" style={{fontSize:"14pt"}}>Email</Label> <br/>
                                <Input name="email" id="emailid" type="email" 
                                    value={newProfile?.email} 
                                    onChange={(e) => {setNewProfile({
                                        userid: userid,
                                        name: newProfile.name,
                                        email: e.target.value,
                                    })}} 
                                    disabled={!editing}
                                />
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
