import React, { useState } from "react";
import './Header.css';
import { Link } from "react-router-dom";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="logo">Study Notes Sharing App</Link>
                <div className={`menu-icon ${isMenuOpen ? "open" : ""}`} onClick={toggleMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
                <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/upload">Upload</Link></li>
                        <li><Link to="/notes">Notes</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Header;
