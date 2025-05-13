import React from 'react';
import './Admin.css';
import Sidebar from '../../componentes/Sidebar/Sidebar';
import AddNotes from '../../componentes/AddNotes/AddNotes';
import ListNotes from '../../componentes/ListNotes/ListNotes';
import Navbar from '../../componentes/Navbar/Navbar';
import { Routes, Route } from 'react-router-dom';

const Admin = () => {
    return (
        <div>
            <Navbar />
            <div className="admin">
                <div className="sidebar">
                    <Sidebar />
                </div>
                <div className="main-content">
                    <Routes>
                        <Route path="addnotes" element={<AddNotes />} />
                        <Route path="listnotes" element={<ListNotes />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Admin;
