import React, { useState, useEffect } from 'react';
import './Profile.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaLock, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchUserData = () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          setUser(userData);
          setEditedUser(userData);
        } else {
          console.error('No user data found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching user data from localStorage:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChangePassword = () => {
    setIsChangingPassword(true);
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
  
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aadharCardNumber: user.aadharCardNumber,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
  
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      toast.success("Password changed successfully");
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.message || 'An error occurred. Please try again.');
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    localStorage.setItem('user', JSON.stringify(editedUser));
    setUser(editedUser);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleCancelEdit = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <ToastContainer />
      <div className="profile-header">
        <img 
          src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} 
          alt={user.name} 
          className="profile-image" 
        />
        <h1>{user.name}</h1>
        <p className="role">{user.role}</p>
      </div>
      <div className="profile-content">
        <div className="profile-info">
          {!isEditing ? (
            <>
              <InfoItem icon={<FaUser />} label="Username" value={user.username} />
              <InfoItem icon={<FaEnvelope />} label="Email" value={user.email} />
              <InfoItem icon={<FaPhone />} label="Mobile" value={user.contact} />
              <InfoItem icon={<FaIdCard />} label="Aadhar Card Number" value={user.aadharCardNumber} />
            </>
          ) : (
            <div className="edit-form">
              <input name="name" value={editedUser.name} onChange={handleInputChange} placeholder="Name" />
              <input name="email" value={editedUser.email} onChange={handleInputChange} placeholder="Email" />
              <input name="contact" value={editedUser.contact} onChange={handleInputChange} placeholder="Mobile" />
              <input name="aadharCardNumber" value={editedUser.aadharCardNumber} onChange={handleInputChange} placeholder="Aadhar Card Number" />
            </div>
          )}
        </div>
        <div className="profile-actions">
          {!isEditing && !isChangingPassword ? (
            <>
              <button className="btn btn-primary" onClick={handleChangePassword}><FaLock /> Change Password</button>
              <button className="btn btn-secondary" onClick={handleEditProfile}><FaEdit /> Edit Profile</button>
            </>
          ) : isEditing ? (
            <>
              <button className="btn btn-primary" onClick={handleSaveProfile}><FaSave /> Save</button>
              <button className="btn btn-secondary" onClick={handleCancelEdit}><FaTimes /> Cancel</button>
            </>
          ) : null}
        </div>
        {isChangingPassword && (
          <div className="password-change-form">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                placeholder="Current Password"
                required
              />
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                placeholder="New Password"
                required
              />
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordInputChange}
                placeholder="Confirm New Password"
                required
              />
              {passwordError && <p className="error">{passwordError}</p>}
              <div className="password-change-actions">
                <button type="submit" className="btn btn-primary">Change Password</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsChangingPassword(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="info-item">
    {icon}
    <span className="label">{label}:</span>
    <span className="value">{value}</span>
  </div>
);

export default Profile;