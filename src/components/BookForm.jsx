import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

const CATEGORIES = [
  "Computer Science",
  "Software Engineering",
  "Data Science",
  "Fiction",
  "Non-Fiction",
  "Science",
  "History",
  "Business",
  "Self-Help",
  "Philosophy",
  "Biography",
  "Mathematics"
];

const BookForm = ({ initialValues, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    price: '',
    quantity: '1',
    published_date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        title: initialValues.title || '',
        author: initialValues.author || '',
        isbn: initialValues.isbn || '',
        category: initialValues.category || '',
        price: initialValues.price !== undefined ? String(initialValues.price) : '',
        quantity: initialValues.quantity !== undefined ? String(initialValues.quantity) : '1',
        published_date: initialValues.published_date || new Date().toISOString().split('T')[0],
        description: initialValues.description || '',
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
    if (!formData.title.trim()) newErrors.title = 'Book title is required';
    if (!formData.author.trim()) newErrors.author = 'Author name is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (formData.quantity === '' || parseInt(formData.quantity, 10) < 0) newErrors.quantity = 'Quantity cannot be negative';

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
        {/* Book Title */}
        <div className="form-group full-width">
          <label htmlFor="title">Book Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            placeholder="e.g. Clean Code"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        {/* Author */}
        <div className="form-group">
          <label htmlFor="author">Author *</label>
          <input
            type="text"
            id="author"
            name="author"
            className="form-control"
            placeholder="e.g. Robert C. Martin"
            value={formData.author}
            onChange={handleChange}
          />
          {errors.author && <span className="error-text">{errors.author}</span>}
        </div>

        {/* ISBN */}
        <div className="form-group">
          <label htmlFor="isbn">ISBN *</label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            className="form-control"
            placeholder="e.g. 978-0132350884"
            value={formData.isbn}
            onChange={handleChange}
          />
          {errors.isbn && <span className="error-text">{errors.isbn}</span>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        {/* Price */}
        <div className="form-group">
          <label htmlFor="price">Price ($) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            id="price"
            name="price"
            className="form-control"
            placeholder="29.99"
            value={formData.price}
            onChange={handleChange}
          />
          {errors.price && <span className="error-text">{errors.price}</span>}
        </div>

        {/* Quantity */}
        <div className="form-group">
          <label htmlFor="quantity">Total Quantity *</label>
          <input
            type="number"
            min="0"
            id="quantity"
            name="quantity"
            className="form-control"
            placeholder="5"
            value={formData.quantity}
            onChange={handleChange}
          />
          {errors.quantity && <span className="error-text">{errors.quantity}</span>}
        </div>

        {/* Published Date */}
        <div className="form-group">
          <label htmlFor="published_date">Published Date</label>
          <input
            type="date"
            id="published_date"
            name="published_date"
            className="form-control"
            value={formData.published_date}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            placeholder="Enter book synopsis or summary..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <X size={16} /> Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <Save size={16} /> {isEditing ? 'Update Book' : 'Save Book'}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
