import React, { useState } from 'react';
import "./LoginSignup.css";
import { useNavigate } from 'react-router-dom';

function LoginSignUp() {
    const [state, setState] = useState('Login');
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: ""
    });

    const navigate = useNavigate();

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleResponse = (responseData) => {
        localStorage.setItem('auth-token', responseData.token);
        localStorage.setItem('username', responseData.user.name);
        localStorage.setItem('role', responseData.user.role);

        if (responseData.user.role === "teacher") {
            navigate("/admin/addnotes");
        } else {
            navigate("/home");
        }
    };

    const login = async () => {
        if (!formData.email || !formData.password) {
            alert("Email and password are required.");
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                handleResponse(data);
            } else {
                alert(data.errors || "Login failed");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Something went wrong.");
        }
    };

    const signup = async () => {
        if (!formData.name || !formData.email || !formData.password || !formData.role) {
            alert("All fields are required.");
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                handleResponse(data);
            } else {
                alert(data.errors || "Signup failed");
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="LoginSignUp">
            <div className="container">
                <h1>{state}</h1>
                <div className="feild">
                    {state === "Sign Up" && (
                        <input type="text" name='name' value={formData.name} onChange={changeHandler} placeholder='Enter Your First Name' />
                    )}
                    <input type="email" name='email' value={formData.email} onChange={changeHandler} placeholder='Enter Your Email' />
                    <input type="password" name='password' value={formData.password} onChange={changeHandler} placeholder='Enter Your Password' />
                    {state === "Sign Up" && (
                        <>
                            <select name="role" value={formData.role} onChange={changeHandler}>
                                <option value="">Select Role</option>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </>
                    )}
                </div>
                <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>
                {
                    state === "Sign Up" ?
                        <p className="alredy-login"> Already have an account? <span onClick={() => setState("Login")}>Login here</span></p> :
                        <p className="alredy-login"> Create an account? <span onClick={() => setState("Sign Up")}>Click here</span></p>
                }
            </div>
        </div>
    );
}

export default LoginSignUp;
