// import React from "react";
// import './Header.css';
// import { Link, useNavigate } from "react-router-dom";


// const Header = () => {
//     const navigate = useNavigate();
//     const handleLogout = () => {
//         localStorage.removeItem('auth-token');
//         localStorage.removeItem('role');
//         localStorage.removeItem('username');
//         navigate('/');
//     };
//     return (
//         <>
//             <nav className="header">
//                 <Link className="logo">Study Notes Sharing App</Link>
//                 <div className="header-box">
//                     <ul>
//                         <li><Link className="link" to="/">Home</Link></li>
//                         <li><Link className="link" to="/upload">Upload</Link></li>
//                         <li><Link className="link" to="/notes">Notes</Link></li>
//                         <li><Link className="link" to="/profile">Profile</Link></li>
//                         <button className="btn-logout" onClick={handleLogout}>Logout</button>
//                     </ul>
//                 </div>
//             </nav>
//         </>
//     );
// };
// export default Header;




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
        navigate('/');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="header">
            <Link className="logo" to="/home">Study Notes Sharing App</Link>

            <div className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>

            <div className={`header-box ${menuOpen ? "open" : ""}`}>
                <ul>
                    <li><Link className="link" to="/">Home</Link></li>
                    <li><Link className="link" to="/upload">Upload</Link></li>
                    <li><Link className="link" to="/notes">Notes</Link></li>
                    <li><Link className="link" to="/profile">Profile</Link></li>
                    <button className="btnLogout" onClick={handleLogout}>Logout</button>
                </ul>
            </div>
        </nav>
    );
};

export default Header;
