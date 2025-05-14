import React, { useEffect, useState } from 'react';
import './ListNotes.css';
import cross_icon from '../../assets/cross_icon.png';

const ListNotes = () => {
    const [allnotes, setAllNotes] = useState([]);

    const fetchInfo = async () => {
        await fetch('https://study-notes-sharing-app-backend.onrender.com/allnotes')
            .then((res) => res.json())
            .then((data) => {
                setAllNotes(data);
            });
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const remove_product = async (id) => {
        await fetch('https://study-notes-sharing-app-backend.onrender.com/removenotes', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
        });
        await fetchInfo();
    };

    return (
        <div className='list-product'>
            <h1>All Notes</h1>
            <div className="listproduct-format-main1">
                <p>Preview</p>
                <p>Title</p>
                <p>Subject</p>
                <p>Remove</p>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {
                    allnotes.map((note) => (
                        <React.Fragment key={note.id}>
                            <div className="listproduct-format-main2 listproduct-format">
                                <img src={note.image} alt="" className="listproduct-product-icon" />
                                <p>{note.title}</p>
                                <p>{note.subject}</p>
                                <img onClick={() => remove_product(note.id)} src={cross_icon} alt="" className="listproduct-remove-icon" />
                            </div>
                            <hr />
                        </React.Fragment>
                    ))
                }
            </div>
        </div>
    );
};

export default ListNotes;