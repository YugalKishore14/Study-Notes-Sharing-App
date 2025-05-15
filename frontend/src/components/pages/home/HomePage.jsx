import React from 'react'
import './HomePage.css';
import { Link } from 'react-router-dom';
const HomePage = () => {
    return (
        <>
            <div className="home__container">

                <section className="home__hero">
                    <h1>Welcome to Study Notes Sharing App 📚</h1>
                    <p>A unified platform to  explore study notes in English and Hindi. </p>
                </section>

                <section className="home__features">
                    <h2>App Features</h2>
                    <div className="home__features-grid">
                        <div className="home__feature-card">📖 Browse All Notes</div>
                        <div className="home__feature-card">✍️ Upload Your Notes</div>
                        <div className="home__feature-card">🔍 Search Notes by Subject</div>
                        <div className="home__feature-card">🌐 Hindi & English Notes</div>
                    </div>
                </section>

                <section className="home__cta">
                    <h2>Get Started Now</h2>
                    <p>Choose what you want to do</p>
                    <div className="home__cta-buttons">
                        <Link to="/home/notes" className="home__btn">📚View All Notes</Link>
                        <Link to="/home/newnotes" className="home__btn">✍️New Notes</Link>
                    </div>
                </section>
            </div>
        </>
    )
}

export default HomePage;