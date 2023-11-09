import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './../img/Nouveau Health-logos_white.png';
import React from 'react';
import { 
  Navbar,
  NavbarBrand,
  NavbarText,
  NavItem,
  NavLink,
 } from 'reactstrap';


export default function InsuranceNav () {
    return (
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
          <NavItem>
            <NavLink href="/insurance">
                <NavbarText>Dashboard</NavbarText>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink>
              <NavbarText>Insurance Plans</NavbarText>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink>
              <NavbarText>Chat</NavbarText>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink>
              <NavbarText>Profile</NavbarText>
            </NavLink>
          </NavItem>
        </Navbar>
    
    )
}