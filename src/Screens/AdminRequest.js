// src/AdminRequest.js
import React, { useState } from 'react';
import api from '../config/api';

const AdminRequest = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    location: '',
    company: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Using a relative path due to the proxy setup in package.json
      const response = await api.post('/submitForm', formData);

      if (response.status === 200) {
        console.log('Form data submitted successfully');
      } else {
        console.error('Error submitting form data');
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </label>
      <br />

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <br />

      <label>
        Location:
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </label>
      <br />

      <label>
        Company:
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
        />
      </label>
      <br />

      <button type="submit">Submit</button>
    </form>
  );
};

export default AdminRequest;
