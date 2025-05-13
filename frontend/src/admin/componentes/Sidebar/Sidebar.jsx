import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
import addicon from '../../assets/addicon.png'
import listicon from '../../assets/listicon.jpg'

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <Link className='linkButton' to={'/admin/addnotes'} style={{ textDecoration: "none" }}>
                <div className="sidebar-item">
                    <img src={addicon} alt="" />
                    <p>Add Notes</p>
                </div>
            </Link>
            <Link className='linkButton' to={'/admin/listnotes'} style={{ textDecoration: "none" }}>
                <div className="sidebar-item">
                    <img src={listicon} alt="" />
                    <p>Notes List</p>
                </div>
            </Link>
        </div>
    )
}

export default Sidebar
