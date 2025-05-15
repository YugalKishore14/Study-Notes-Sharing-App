import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../../header/Header';
import AllNotes from '../allnotes/AllNotes';
import NewNotes from '../newnotes/NewNotes';
import LoginSignup from '../login&signup/LoginSignup';
import HomePage from './HomePage';

const Home = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="notes" element={<AllNotes />} />
                <Route path="newnotes" element={<NewNotes />} />
                <Route path="login" element={<LoginSignup />} />
                <Route path="*" element={<HomePage />} />
            </Routes>
        </>
    );
};

export default Home;
