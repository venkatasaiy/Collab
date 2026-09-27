import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookForm from '../components/BookForm';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, updateBook } = useApp();

  const bookId = parseInt(id, 10);
  const existingBook = books.find(b => b.id === bookId);

  if (!existingBook) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Book Not Found</h3>
        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0' }}>
          The requested book ID #{id} does not exist in the catalog.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/books')}>
          Back to Books
        </button>
      </div>
    );
  }

  const handleSubmit = (formData) => {
    updateBook(bookId, formData);
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
          <h2>Edit Book Information</h2>
          <p>Update fields for "{existingBook.title}"</p>
        </div>
      </div>

      <BookForm
        initialValues={existingBook}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/books')}
        isEditing={true}
      />
    </div>
  );
};

export default EditBook;
