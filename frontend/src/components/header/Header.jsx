import React, { useState } from "react";
import './Header.css';
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="studyHeader__container">
            <Link className="studyHeader__logo" to="/home">Study Notes Sharing App</Link>

            <div className="studyHeader__hamburger" onClick={toggleMenu}>
                <span className="studyHeader__bar"></span>
                <span className="studyHeader__bar"></span>
                <span className="studyHeader__bar"></span>
            </div>

            <div className={`studyHeader__menu ${menuOpen ? "open" : ""}`}>
                <ul>
                    <li><Link className="studyHeader__link" to="/home">Home</Link></li>
                    <li><Link className="studyHeader__link" to="/home/notes">All-Notes</Link></li>
                    <li><Link className="studyHeader__link" to="/home/newnotes">New-Notes</Link></li>
                    <li>
                        <button className="studyHeader__logout" onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Header;
