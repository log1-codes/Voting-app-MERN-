import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            console.log('Submitting form:', formData);
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log('Response:', response);
            console.log('Data:', data);
            // In both Signup.jsx and Login.jsx
            console.log('Full response:', response);
            console.log('Response status:', response.status);
            console.log('Response data:', data);
            console.log('User data:', data.user);
            console.log('User ID:', data.user?._id);

            if (response.ok ) {
                const userDataToStore = { ...data.user };
                console.log('Attempting to store user data:', userDataToStore);
                localStorage.setItem('user', JSON.stringify(userDataToStore));
                console.log('Stored user data:', JSON.parse(localStorage.getItem('user')));

                toast.success(`Login Successful, Welcome ${userDataToStore.name}`);
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
        <div className='login'>
            <ToastContainer />
            <form onSubmit={handleSubmit} className='login-form'>
                <h2>Login</h2>
                <input
                    type="text"
                    name="aadharCardNumber"
                    placeholder="Aadhar Card Number"
                    value={formData.aadharCardNumber}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
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
    );
};

export default Login;
