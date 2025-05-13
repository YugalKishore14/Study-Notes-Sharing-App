import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');  ////////////////////

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        navigate('/');
    };

    return (
        <div className='navbar'>
            <h2>Welcome <span>{username}</span></h2>
            <div className="nav-right">
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </div>
    );
};

export default Navbar;

