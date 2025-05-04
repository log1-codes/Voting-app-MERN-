import React, { useState, useEffect } from 'react';
import './Profile.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaSignOutAlt ,FaEnvelope, FaPhone, FaIdCard, FaLock, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          setUser(storedUser);
          setEditedUser(storedUser);
        } else {
          console.error('No user data found in localStorage');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      }
    };

    fetchUserData();
  }, [navigate]);

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
      const response = await fetch('https://voting-app-mern-backend-2.onrender.com/api/auth/change-password', {
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

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('aadharCardNumber', editedUser.aadharCardNumber);
      formData.append('name', editedUser.name);
      formData.append('username', editedUser.username);
      formData.append('email', editedUser.email);
      formData.append('contact', editedUser.contact);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await fetch('https://voting-app-mern-backend-2.onrender.com/api/auth/edit-profile', {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setUser(data.user);
      setEditedUser(data.user);
      setIsEditing(false);
      setSelectedImage(null);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('storage'));
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'An error occurred while updating the profile');
    }
  };

  const handleCancelEdit = () => {
    setEditedUser(user);
    setIsEditing(false);
    setSelectedImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <ToastContainer />
      <h1 className="profile-title">User Profile</h1>
      <div className="profile-content">
        <div className="profile-header">
          <img 
            src={user && user.image ? `https://voting-app-mern-backend-2.onrender.com/${user.image}` : `https://api.dicebear.com/6.x/initials/svg?seed=${user?.name || 'User'}`} 
            alt={user?.name || 'User'} 
            className="profile-image" 
          />
          <h2 className="animate-text">{user.name}</h2>
          <p className="role animate-text">{user.role}</p>
        </div>
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
              <input name="name" value={editedUser.name} onChange={handleInputChange} placeholder="Name" className="animate-input" />
              <input name="username" value={editedUser.username} onChange={handleInputChange} placeholder="Username" className="animate-input" />
              <input name="email" value={editedUser.email} onChange={handleInputChange} placeholder="Email" className="animate-input" />
              <input name="contact" value={editedUser.contact} onChange={handleInputChange} placeholder="Mobile" className="animate-input" />
              <input type="file" onChange={handleImageChange} accept="image/*" className="animate-input" />
              <div className="non-editable">
                <span>Aadhar Card Number: {user.aadharCardNumber}</span>
              </div>
            </div>
          )}
        </div>
        <div className="profile-actions">
          {!isEditing && !isChangingPassword ? (
            <>
              <button className="btn btn-primary animate-btn" onClick={handleChangePassword}><FaLock /> Change Password</button>
              <button className="btn btn-secondary animate-btn" onClick={handleEditProfile}><FaEdit /> Edit Profile</button>
              <button className="btn btn-danger animate-btn" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
            </>
          ) : isEditing ? (
            <>
              <button className="btn btn-primary animate-btn" onClick={handleSaveProfile}><FaSave /> Save</button>
              <button className="btn btn-secondary animate-btn" onClick={handleCancelEdit}><FaTimes /> Cancel</button>
            </>
          ) : null}
        </div>
        {isChangingPassword && (
          <div className="password-change-form animate-form">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                placeholder="Current Password"
                required
                className="animate-input"
              />
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                placeholder="New Password"
                required
                className="animate-input"
              />
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordInputChange}
                placeholder="Confirm New Password"
                required
                className="animate-input"
              />
              {passwordError && <p className="error">{passwordError}</p>}
              <div className="password-change-actions">
                <button type="submit" className="btn btn-primary animate-btn">Change Password</button>
                <button type="button" className="btn btn-secondary animate-btn" onClick={() => setIsChangingPassword(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="info-item animate-info">
    {icon}
    <span className="label">{label}:</span>
    <span className="value">{value}</span>
  </div>
);

export default Profile;
