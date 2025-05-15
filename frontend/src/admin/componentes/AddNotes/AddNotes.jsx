
import React, { useState } from 'react';
import './AddNotes.css';
import upload_area from "../../assets/upload_area.svg";

const AddNotes = () => {
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        title: "",
        subject: ""
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setProductDetails(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const Add_product = async () => {
        if (!image || !productDetails.title || !productDetails.subject) {
            alert("All fields are required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('notes', image);
            // https://study-notes-sharing-app-backend.onrender.com
            const uploadRes = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadRes.json();

            if (!uploadData.success) {
                alert('Image upload failed!');
                return;
            }

            const newNote = {
                title: productDetails.title,
                subject: productDetails.subject,
                image: uploadData.image_url,
            };
            // https://study-notes-sharing-app-backend.onrender.com
            const noteRes = await fetch('http://localhost:5000/api/addnotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNote),
            });

            const noteData = await noteRes.json();

            if (noteData.success) {
                alert('Note added successfully!');
                setProductDetails({ title: "", subject: "" });
                setImage(null);
            } else {
                alert('Failed to add note');
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong");
        }
    };

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Note Title</p>
                <input
                    type="text"
                    name="title"
                    placeholder="Type here"
                    value={productDetails.title}
                    onChange={changeHandler}
                />
            </div>
            <div className="addproduct-itemfield">
                <p>Subject</p>
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject name"
                    value={productDetails.subject}
                    onChange={changeHandler}
                />
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img
                        src={image ? URL.createObjectURL(image) : upload_area}
                        alt="Upload preview"
                        className='addproduct-thumnail-img'
                    />
                </label>
                <input
                    type="file"
                    id="file-input"
                    accept="image/*,application/pdf"
                    hidden
                    onChange={imageHandler}
                />
            </div>
            <button onClick={Add_product} className='addproduct-btn'>UPLOAD</button>
        </div>
    );
};

export default AddNotes;
