import React from 'react';
import {useState} from 'react';
import ReactDOM from 'react-dom/client';
import {createSearchParams, useNavigate} from 'react-router-dom'
import logo from './../img/Nouveau Health-logos_white.png';
import {Navbar, NavbarBrand, NavbarText, Button, Col, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import axios from 'axios';

//let REGISTRATION_URL = "nouveau-app.azurewebsites.net/login";
let LOGIN_URL = "http://localhost:8080/login"
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const uniqueUser = async (email) => {
        const unique = await axios.get(LOGIN_URL+'/'+email);
        return unique.data?.unique;
    }

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // check all fields filled out
        if (email === '' || password === '') {
            alert('Login failed. Please fill out all fields');
            return;
        }

        // validate login
        axios({
            method: 'post',
            url: LOGIN_URL,
            data: {
                email: email,
                password: password
            }
        })
        .then((response) => {
            if(!response.data.mfa) {
                alert('Logging you in...')

                // redirect
            } else {
                var result = response.data.response.result
                if(result == 'auth') {
                    alert('Moving to Two-Factor Authentication')
                    navigate({
                        pathname: "auth",
                        search: '?' + createSearchParams({
                            userid: response.data.userid,
                            role: response.data.role
                        })
                    })
                } else if (result == 'allow') {
                    alert('Logging you in...')

                    // redirect
                } else if (result == "deny") {
                    alert('Access denied: ' + response.data.response.status_msg)
                    navigate('../')
                } else { // result == "enroll" -- shouldn't happen normally, just deny for now (in future either prompt them to enroll or set mfa to false and log them in)
                    alert('Access denied')
                    navigate('../')
                }
            }
        }, (error) => {
            console.log(error);
            alert(`Login failed: ${error.response.data}. Please check your information and try again`);
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
            </Navbar>
            <div>
                <Form onSubmit={handleSubmit} method="post">
                    <h2>Login</h2>

                    <FormGroup>
                        <Label for="emailid">Email</Label> <br/>
                        <Input name="email" id="emailid" type="email" onChange={(e) => {setEmail(e.target.value)}} /> <br/> <br/>

                        <Label for="passwordid">Password</Label> <br/>
                        <Input name="password" id="passwordid" type="password" onChange={(e) => {setPassword(e.target.value)}} />
                    </FormGroup> 
                    <br/>

                    <Button type='submit'>Log in</Button>
                </Form>
            </div>
        </>
    );
  }