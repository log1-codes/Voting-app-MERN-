import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaLock, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        aadharCardNumber: '',
        password: '',
        role: 'voter'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://voting-app-mern-backend-2.onrender.com/api/auth/login', {
                aadharCardNumber: formData.aadharCardNumber,
                password: formData.password,
                role: formData.role
            });

            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                // Dispatch a storage event to notify other components
                window.dispatchEvent(new Event('storage'));
                navigate('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className='login-container'>
            <ToastContainer />
            <div className='login-card'>
                <div className='login-header'>
                    <FaUserCircle className='login-icon' />
                    <h2>Login</h2>
                </div>
                <form onSubmit={handleLogin} className='login-form'>
                    <div className='input-group'>
                        <FaUser className='input-icon' />
                        <input
                            type="text"
                            name="aadharCardNumber"
                            placeholder="Aadhar Card Number"
                            value={formData.aadharCardNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='input-group'>
                        <FaLock className='input-icon' />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="voter">Voter</option>
                        <option value="candidate">Candidate</option>
                    </select>
                    <button type="submit" className='login-submit-button'>Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
