import React, { useState } from 'react';
import './Signup.css';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        contact: '',
        aadharCardNumber: '',
        password: '',
        role: 'voter' // Default role
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/auth/signup', {
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
            console.log('Signup response:', data);  // Log the response
    
            if (data.user) {
                // If the backend sends user data, store it
                const userDataToStore = { ...data.user };
                delete userDataToStore.password;  // Remove password for security
                localStorage.setItem('user', JSON.stringify(userDataToStore));
                console.log('Stored user data:', userDataToStore);  // Log stored data
                toast.success(`Signup Successful, Welcome ${data.user.name}`);
                navigate('/login');
            } else {
                // If no user data is sent, store the form data (except password)
                const userDataToStore = { ...formData };
                delete userDataToStore.password;
                localStorage.setItem('user', JSON.stringify(userDataToStore));
                console.log('Stored form data:', userDataToStore);  // Log stored data
                toast.success(`Signup Successful, Welcome ${formData.name}`);
                navigate('/login');
            }
        } catch (error) {
            console.error('Detailed error:', error);
            toast.error(`An error occurred: ${error.message}`);
        }
    };

    return (
        <div className="signUp">
            <form onSubmit={handleSubmit}>
                <label>Name:
                    <input type="text" name="name" placeholder='Enter your Name here' onChange={handleChange} required />
                </label>
                <br />
                <label>Username:
                    <input type="text" name="username" placeholder='Enter your Username here' onChange={handleChange} required />
                </label>
                <br />
                <label>Email:
                    <input type="email" name="email" placeholder='Enter your Email here' onChange={handleChange} required />
                </label>
                <br />
                <label>Contact:
                    <input type="tel" name="contact" placeholder='Enter your Contact no. here' onChange={handleChange} required />
                </label>
                <br />
                <label>Aadhar Card Number:
                    <input type="text" name="aadharCardNumber" placeholder='Enter your Aadhar no here' onChange={handleChange} required />
                </label>
                <br />
                <label>Select Role:
                    <select name="role" onChange={handleChange} value={formData.role}>
                        <option value="voter">Voter</option>
                        <option value="candidate">Candidate</option>
                    </select>
                </label>
                <br />
                <label>Password:
                    <input type="password" name="password" placeholder='Enter your Password' onChange={handleChange} required />
                </label>
                <br />
                <button type="submit" className='signup-submit-button'>Submit</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Signup;
