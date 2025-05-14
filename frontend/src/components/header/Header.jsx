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
        <nav className="studyHeader__container">
            <Link className="studyHeader__logo" to="/home">Study Notes Sharing App</Link>

            <div className="studyHeader__hamburger" onClick={toggleMenu}>
                <span className="studyHeader__bar"></span>
                <span className="studyHeader__bar"></span>
                <span className="studyHeader__bar"></span>
            </div>

            <div className={`studyHeader__menu ${menuOpen ? "open" : ""}`}>
                <ul>
                    <li><Link className="studyHeader__link" to="/">Home</Link></li>
                    <li><Link className="studyHeader__link" to="/upload">Upload</Link></li>
                    <li><Link className="studyHeader__link" to="/notes">Notes</Link></li>
                    <li><Link className="studyHeader__link" to="/profile">Profile</Link></li>
                    <button className="studyHeader__logout" onClick={handleLogout}>Logout</button>
                </ul>
            </div>
        </nav>

    );
};

export default Header;
