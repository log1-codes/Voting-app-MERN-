import React, { useState } from 'react';
import './Signup.css';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaLock, FaUserCircle } from 'react-icons/fa';
const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        contact: '',
        aadharCardNumber: '',
        password: '',
        role: 'voter'
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://voting-app-mern-backend.onrender.com/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }

            const data = await response.json();
            console.log('Signup response:', data);

            if (data.user) {
                const userDataToStore = { ...data.user };
                delete userDataToStore.password;
                localStorage.setItem('user', JSON.stringify(userDataToStore));
                console.log('Stored user data:', userDataToStore);
                toast.success(`Signup Successful, Welcome ${data.user.name}`);
                navigate('/login');
            } else {
                const userDataToStore = { ...formData };
                delete userDataToStore.password;
                localStorage.setItem('user', JSON.stringify(userDataToStore));
                console.log('Stored form data:', userDataToStore);
                toast.success(`Signup Successful, Welcome ${formData.name}`);
                navigate('/login');
            }
        } catch (error) {
            console.error('Detailed error:', error);
            toast.error(`An error occurred: ${error.message}`);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <FaUserCircle className="signup-icon" />
                    <h2>Sign Up</h2>
                </div>
                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="input-group">
                        <FaUser className="input-icon" />
                        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <FaUser className="input-icon" />
                        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <FaEnvelope className="input-icon" />
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <FaPhone className="input-icon" />
                        <input type="tel" name="contact" placeholder="Contact" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <FaIdCard className="input-icon" />
                        <input type="text" name="aadharCardNumber" placeholder="Aadhar Card Number" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    </div>
                    <select name="role" onChange={handleChange} value={formData.role}>
                        <option value="voter">Voter</option>
                        <option value="candidate">Candidate</option>
                    </select>
                    <button type="submit" className="signup-submit-button">Sign Up</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Signup;
