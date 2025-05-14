import React, { useState } from 'react';
import './AddNotes.css';
import upload_area from "../../assets/upload_area.svg";

const AddNotes = () => {
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        title: "",
        image: "",
        subject: ""
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setProductDetails(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const Add_product = async () => {
        let formData = new FormData();
        formData.append('notes', image);

        let response = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: formData
        });

        let responseData = await response.json();

        if (responseData.success) {
            let updatedProduct = {
                title: productDetails.title,
                image: responseData.image_url,
                subject: productDetails.subject
            };

            let productResponse = await fetch('http://localhost:5000/api/addnotes', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct),
            });

            let productData = await productResponse.json();
            productData.success ? alert('Note Added') : alert('Failed');
        } else {
            alert('Image Upload Failed');
        }
    };

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Note Title</p>
                <input value={productDetails.title} onChange={changeHandler} type="text" name='title' placeholder='Type here' />
            </div>
            <div className="addproduct-itemfield">
                <p>Subject</p>
                <input value={productDetails.subject} onChange={changeHandler} type="text" name='subject' placeholder='Subject name' />
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} alt="" className='addproduct-thumnail-img' />
                </label>
                <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
            </div>
            <button onClick={Add_product} className='addproduct-btn'>UPLOAD</button>
        </div>
    );
};

export default AddNotes;
