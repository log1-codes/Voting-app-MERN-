import React, { useState, useEffect } from 'react';
import './Profile.css';

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
    // Fetch user data from localStorage
    const fetchUserData = () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData ) {
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
        console.error('Error response:', data);
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
  
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      alert('Password changed successfully');
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
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <div className="profile-info">
        {!isEditing ? (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Mobile:</strong> {user.contact}</p>
            <p><strong>Aadhar Card Number:</strong> {user.aadharCardNumber}</p>
          </>
        ) : (
          <div className="edit-popup">
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
            <button className="buttons" onClick={handleChangePassword}>Change Password</button>
            <button className="buttons" onClick={handleEditProfile}>Edit Profile</button>
          </>
        ) : isEditing ? (
          <>
            <button className="buttons" onClick={handleSaveProfile}>Save</button>
            <button className="buttons" onClick={handleCancelEdit}>Cancel</button>
          </>
        ) : null}
      </div>
      {isChangingPassword && (
        <div className="password-change-popup">
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
              <button type="submit" className="buttons">Change Password</button>
              <button type="button" className="buttons" onClick={() => setIsChangingPassword(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;