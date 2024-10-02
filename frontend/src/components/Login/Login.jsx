import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaLock, FaUserCircle } from 'react-icons/fa';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                const userDataToStore = { ...data.user };
                localStorage.setItem('user', JSON.stringify(userDataToStore));
                toast.success(`Welcome back, ${userDataToStore.name}!`);
                setTimeout(() => navigate('/'), 2000);
            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again.');
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
                <form onSubmit={handleSubmit} className='login-form'>
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