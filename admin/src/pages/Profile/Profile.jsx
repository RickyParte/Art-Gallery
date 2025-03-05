import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';



const Profile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        bio: '',
          instagram: '',
          twitter: '',
          linkedin: '',
          portfolio:'',
        location: {
          line1: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'IN', // Default to 'IN'
        },
        profilePicture: '', // To store profile picture file
      });
    
      const [message, setMessage] = useState('');
      const [error, setError] = useState('');
      const [image, setImage] = useState(null); // To handle image file
    
      // Get artist ID from localStorage
      const artistId = localStorage.getItem('artistId');
    
      useEffect(() => {
        // Fetch artist details
        const fetchArtist = async () => {
          try {
            const { data } = await axios.get(`http://localhost:4000/api/artist/info/${artistId}`);
            
            setFormData({
                ...data,
                location: data.customerAddress || formData.location, // Populate address fields
                instagram: data.socialLink.instagram ,
                twitter: data.socialLink.twitter ,
                linkedin: data.socialLink.linkedin , // Adjust the name as per the API response
                portfolio: data.socialLink.portfolio 
              });
            
          } catch (err) {
            setError('Error fetching artist data');
          }
        };
    
        if (artistId) {
          fetchArtist();
        } else {
          setError('Artist ID not found in localStorage');
        }
      }, [artistId]);
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        if (name.includes('location.')) {
            const [_, field] = name.split('.');
            setFormData((prev) => ({
              ...prev,
              location: { ...prev.location, [field]: value },
            }));
          } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
          }
      };
    
      // Handle file input for profile picture
      const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setImage(file);
        }
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const form = new FormData();
          form.append('name', formData.name);
          form.append('email', formData.email);
          form.append('phone', formData.phone);
          form.append('dob', formData.dob);
          form.append('bio', formData.bio);
          
          const social={
            linkedin:formData.linkedin,            
            instagram:formData.instagram,            
            twitter:formData.twitter,            
            portfolio:formData.portfolio
          };

          form.append('socialLink',JSON.stringify(social))
          form.append('location', JSON.stringify(formData.location));
    
          if (image) {
            form.append('profilePicture', image);
          }
    
          const { data } = await axios.put(`http://localhost:4000/api/artist/update/${artistId}`, form, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          toast.success(data.message,{
            position: 'top-right',
          });
                } catch (err) {
          setError('Error updating profile');
        }
      };

  return (
    <>
    <ToastContainer />
    <div className="update-artist-profile">
      <h2>Update Profile</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Other Fields */}
        <div>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <h3>Social Links</h3>
          <label>Instagram</label>
          <input
            type="text"
            name="instagram"
            value={formData.instagram}
            onChange={handleInputChange}
          />
          <label>Twitter</label>
          <input
            type="text"
            name="twitter"
            value={formData.twitter}
            onChange={handleInputChange}
          />
          <label>LinkedIn</label>
          <input
            type="text"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleInputChange}
          />
          <label>Portfolio</label>
          <input
            type="text"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleInputChange}
          />
        </div>
        {/* Address Fields */}
        <div>
          <h3>Address</h3>
          <label>Address Line 1</label>
          <input
            type="text"
            name="location.line1"
            value={formData.location.line1}
            onChange={handleInputChange}
          />
          <label>City</label>
          <input
            type="text"
            name="location.city"
            value={formData.location.city}
            onChange={handleInputChange}
          />
          <label>State</label>
          <input
            type="text"
            name="location.state"
            value={formData.location.state}
            onChange={handleInputChange}
          />
          <label>Postal Code</label>
          <input
            type="text"
            name="location.postalCode"
            value={formData.location.postalCode}
            onChange={handleInputChange}
          />
          <label>Country</label>
          <input
            type="text"
            name="location.country"
            value={formData.location.country}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleImageChange}
          />
          {image && <p>Selected image: {image.name}</p>}
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
 </> );
};

export default Profile;