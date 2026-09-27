import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookForm from '../components/BookForm';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';

const AddBook = () => {
  const { addBook } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    addBook(formData);
    navigate('/books');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-title">
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => navigate('/books')}
            style={{ marginBottom: '0.5rem' }}
          >
            <ArrowLeft size={16} /> Back to Books
          </button>
          <h2>Add New Book</h2>
          <p>Fill in details to register a new book in the library catalog.</p>
        </div>
      </div>

      <BookForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/books')}
        isEditing={false}
      />
    </div>
  );
};

export default AddBook;
