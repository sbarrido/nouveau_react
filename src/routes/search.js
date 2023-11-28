import React from 'react';
import {useState, useEffect} from 'react';
import {createSearchParams, Link, useNavigate} from 'react-router-dom'
import {Form, Label, Spinner, Button} from 'reactstrap';
import ReactDOM from 'react-dom/client';
import PatientNav from '../components/PatientNav'
import axios from 'axios';
import Dashboard from '../components/Dashboard';

//let SEARCH_URL = "https://nouveau-app.azurewebsites.net/search";
let SEARCH_URL = "http://localhost:8080/search";
export default function Search() {
    //const searchParams = new URLSearchParams(window?.location?.search);
    //const userid = searchParams.get('userid')
    const userid = Number(sessionStorage.getItem('userid'))
    const [searchTerms, setSearchTerms] = useState('');
    const [supportCovid, setSupportCovid] = useState(false);
    var search = '';
    var covid = false;
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    var searched = false;

    useEffect(() => {

    });

    const navigate = useNavigate();

    const getSearchResults = () => {
        searched = true;
        setLoading(true);


        axios({
            method: 'post',
            url: SEARCH_URL,
            data: {
                searchTerms: search,
                filters: {
                    covid: covid
                }
            }
        })
        .then((response) => {
            setResults(response.data);
            setLoading(false);
            console.log(response.data);
        }, (error) => {
            alert(`Error searching. Please try again later`);
            setLoading(false);
        });
    }

    /*
    const displaySearchResults = () => {
        if(!searched) {
            return <></>
        }

        if(loading) {
            return <Spinner />
        }

        if(results.length === 0) {
            return (<p>No results found</p>);
        }

        return (
            <table>
            <tbody>
              {results.map((profile, i) => (
              <tr key={i}>
                <td>{profile.name}</td>
                <td>{profile.specialty}</td>
                <td>{profile.email}</td>
                <td>{profile.phone}</td>
                <td>{profile.covid ? "Supports Covid Care" : "Does not support Covid Care"}</td>
                <td>{profile.feedback}</td>
              </tr>
            ))}
            </tbody>
          </table>
        );
    }
    */

    const handleSubmit = async (event) => {
        event.preventDefault();

        search = searchTerms;
        covid = supportCovid;
        console.log(search + "\n" + covid);
        
        getSearchResults();
    }

    const appointmentRedirect = (doctorid) => {
        /*
        navigate({
            pathname: "../appointment",
            search: '?' + createSearchParams({
                doctorid: doctorid
            })
        })
        */

        sessionStorage.setItem('apptdoctorid', doctorid)
        navigate("../appointment")
    }

    return (
        <>
            <Dashboard role='patient'/>
            <div style={{marginTop: "2%", marginLeft: "5%", marginRight: "5%", display: "block", textAlign: "left"}}>
                <h2>Search for Doctors</h2>
                <Form onSubmit={handleSubmit} method="post" style={{display: 'inline-block', width:"100%"}}>
                    <input style={{width:"70%"}} type="text" value={searchTerms} onChange={(e) => setSearchTerms(e.target.value)} placeholder="Search by doctor name or specialization"/>
                    <button type="submit">Search</button>
                    <br/>
                    <Label for="covidid">Show only doctors that support Covid patient care</Label>
                    <input name="covid" id="covidid" type="checkbox" onChange={(e) => setSupportCovid(!supportCovid)}/>
                </Form>
                
                <hr/>
                
                <div>
                    <table style={{tableLayout:"fixed", width:"100%"}}>
                        <thead>
                            <tr>
                                <th style={{width:"25%"}}>Doctor</th>
                                <th style={{width:"25%"}}>Contact Info</th>
                                <th style={{width:"25%"}}>Rating</th>
                                <th style={{width:"25%"}}>Book Appointment</th>
                            </tr>
                        </thead>
                        <tbody>
                        {results.map((profile, i) => (
                        <tr key={i} style={{border: "1px solid"}}>
                            <td style={{width:"25%"}}>
                                <p style={{marginBottom: "0px", fontSize: "14pt"}}>{profile.name} </p>
                                <p style={{marginBottom: "0px", fontSize: "12pt"}}>{profile.specialty} </p>
                                <p style={{marginBottom: "0px", fontSize: "9pt"}}>{profile.covid ? "Supports Covid Care" : "Does not support Covid Care"} </p>
                            </td>
                            <td style={{width:"25%"}}><b>Email:</b> {profile.email}<br/> <b>Phone:</b> {profile.phone}</td>
                            <td style={{width:"25%"}}>{profile.feedback} {profile.feedback !== "No Reviews Yet" ? '⭐' : null}</td>
                            <td style={{width:"25%", paddingRight: "10px"}}>
                                <Button onClick={() => {appointmentRedirect(profile.id)}}>Book Appointment</Button>
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
