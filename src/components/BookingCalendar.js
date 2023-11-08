import Calendar from 'react-calendar'
import './BookingCalendar.css'
import React from 'react';
import { 
    Navbar,
    NavbarBrand,
    NavbarText,
    NavItem,
    NavLink,
} from 'reactstrap';

export default function PatientNav (props) {
    const dayClick = props.onClickDay

    const getMinDate = () => {
        var date = new Date();
        date.setDate(date.getDate() + 1);

        return date;
    }

    return (
        <Calendar minDate={getMinDate()} onClickDay={dayClick}>
        </Calendar>
    )
}