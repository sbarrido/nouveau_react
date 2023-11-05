import React from 'react';
import {useState} from 'react';
import ReactDOM from 'react-dom/client';
import {createSearchParams, useNavigate} from 'react-router-dom'
import logo from './../img/Nouveau Health-logos_white.png';
import {Navbar, NavbarBrand, NavbarText, Button, Col, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import axios from 'axios';

let REGISTRATION_URL = "https://nouveau-app.azurewebsites.net/registration";
//let REGISTRATION_URL = "http://localhost:8080/registration"
export default function Registration() {

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        // get data from form - prob change to states bc these are stored in url
        const name = event.target.name.value;
        const email = event.target.email.value;
        const position = event.target.position.value;
        const password = event.target.password.value;
        const confirm = event.target.confirm.value;
        const mfa = JSON.parse(event.target.mfa.value);
        //alert(`Name: ${name}\nEmail: ${email}\nPosition: ${position}\nPassword: ${password}\nConfirm: ${confirm}\nMFA: ${typeof(mfa)}`);

        // check all fields filled out
        if (name === '' || email === '' || password === '' || confirm === '') {
            alert('Registration failed. Please fill out all fields');
            return;
        }

        // check email is unique w/ api call - say unsuccessful if it is unsuccessful
     
        // check password (any parameters, equal to confirm) - say unsuccessful if it is unsuccessful
        if (password !== confirm) {
            alert('Registration failed. Passwords do not match.');
            return;
        }

        // encrypt/tokenize password

        // send data to backend, give confirmation if successful, and return to login page
        axios({
            method: 'post',
            url: REGISTRATION_URL,
            data: {
                name: name,
                email: email,
                role: position,
                password: password,
                mfa: mfa
            }
        })
        .then((response) => {
            if (response.status === 200) {
                alert(`Registration successful`);
                if(!mfa) {
                    navigate('/')
                } else {
                    navigate({
                        pathname: "enroll",
                        search: '?' + createSearchParams({
                            userid: response.data.userid
                        })
                    })
                }
            } else {
                alert(`Registration failed. There was an error saving the user. Please try again`);
                navigate('/registration')
            }
        }, (error) => {
            console.log(error);
            alert(`Registration failed. There was an error saving the user. Please try again`);
            navigate('/registration')
        });
    }

    return (
        <>
            <Navbar
            color="dark"
            dark
            >
            <NavbarBrand href="/">
                <img
                alt="NV Logo"
                src={logo}
                style={{
                    height: 60,
                    width: 60
                }}
                />
                Nouveau Health
            </NavbarBrand>
            <NavbarText>Login</NavbarText>
            </Navbar>
            <div>
                <Form onSubmit={handleSubmit} method="post">
                    <h2>Enter your information</h2>

                    <FormGroup>
                        <Label for="nameid">Name</Label> <br/>
                        <Input name="name" id="nameid" type="text"/> <br/> <br/>

                        <Label for="emailid">Email</Label> <br/>
                        <Input name="email" id="emailid" type="email"/> <br/> <br/>

                        <Label for="positionid">What is your position?</Label> <br/>
                        <Input name="position" id="positionid" type="select">
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                            <option value="insurance">Insurance Provider</option>
                        </Input>
                    </FormGroup>
                    <br/>
                    <FormGroup>
                        <Label for="passwordid">Password</Label> <br/>
                        <Input name="password" id="passwordid" type="password" /> <br/><br/>

                        <Label for="confirmid">Confirm Password</Label> <br/>
                        <Input name="confirm" id="confirmid" type="password" /> <br/><br/>
                    </FormGroup> 

                    <FormGroup>
                        <Label for="mfaid">Do you want to enroll in Multi-factor Authentication with DUO?</Label> <br/>
                        <Input name="mfa" id="mfaid" type="select">
                            <option value='true'>Yes</option>
                            <option value='false'>No</option>
                        </Input>
                    </FormGroup>
                    <br/>

                    <Button type='submit'>Submit</Button>
                </Form>
            </div>
        </>
    );
  }
