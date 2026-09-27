import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

const BorrowerForm = ({ initialValues, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || '',
        email: initialValues.email || '',
        phone: initialValues.phone || '',
        address: initialValues.address || '',
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card form-card">
      <div className="form-grid">
        {/* Borrower Name */}
        <div className="form-group full-width">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            placeholder="e.g. Jane Doe"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="e.g. jane.doe@university.edu"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="text"
            id="phone"
            name="phone"
            className="form-control"
            placeholder="e.g. +1 (555) 019-2834"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        {/* Address */}
        <div className="form-group full-width">
          <label htmlFor="address">Address *</label>
          <textarea
            id="address"
            name="address"
            className="form-control"
            rows={3}
            placeholder="Enter full physical address..."
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <span className="error-text">{errors.address}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <X size={16} /> Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <Save size={16} /> {isEditing ? 'Update Borrower' : 'Save Borrower'}
        </button>
      </div>
    </form>
  );
};

export default BorrowerForm;
