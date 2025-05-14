// import React, { useEffect, useState } from 'react';
// import './ListNotes.css';
// import cross_icon from '../../assets/cross_icon.png';

// const ListNotes = () => {
//     const [allnotes, setAllNotes] = useState([]);

//     const fetchInfo = async () => {
//         await fetch('https://study-notes-sharing-app-backend.onrender.com/allnotes')
//             .then((res) => {
//                 console.log(res);
//                 return res.json()
//             })

//             .then((data) => {
//                 console.log(res);
//                 setAllNotes(data);
//             });
//     };

//     useEffect(() => {
//         fetchInfo();
//     }, []);

//     const remove_product = async (id) => {
//         await fetch('https://study-notes-sharing-app-backend.onrender.com/removenotes', {
//             method: 'POST',
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ id })
//         });
//         await fetchInfo();
//     };

//     return (
//         <div className='list-product'>
//             <h1>All Notes</h1>
//             <div className="listproduct-format-main1">
//                 <p>Preview</p>
//                 <p>Title</p>
//                 <p>Subject</p>
//                 <p>Remove</p>
//             </div>
//             <div className="listproduct-allproducts">
//                 <hr />
//                 {
//                     allnotes.map((note) => (
//                         <React.Fragment key={note.id}>
//                             <div className="listproduct-format-main2 listproduct-format">
//                                 <img src={note.image} alt="" className="listproduct-product-icon" />
//                                 <p>{note.title}</p>
//                                 <p>{note.subject}</p>
//                                 <img onClick={() => remove_product(note.id)} src={cross_icon} alt="" className="listproduct-remove-icon" />
//                             </div>
//                             <hr />
//                         </React.Fragment>
//                     ))
//                 }
//             </div>
//         </div>
//     );
// };

// export default ListNotes;





import React, { useEffect, useState } from 'react';
import './ListNotes.css';
import cross_icon from '../../assets/cross_icon.png';

const ListNotes = () => {
    const [allnotes, setAllNotes] = useState([]);

    const fetchInfo = async () => {
        try {
            // http://localhost:5000/api/allnotes
            const response = await fetch('https://study-notes-sharing-app-backend.onrender.com/api/allnotes');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); // JSON डेटा को ठीक से प्रोसेस करें
            setAllNotes(data);
        } catch (error) {
            console.error("Error fetching notes:", error);  // Error handling
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const remove_product = async (id) => {
        try {
            // http://localhost:5000/api/removenotes
            await fetch('https://study-notes-sharing-app-backend.onrender.com/api/removenotes', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id })
            });
            fetchInfo(); // फिर से डेटा लोड करें
        } catch (error) {
            console.error("Error removing note:", error); // Error handling
        }
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
