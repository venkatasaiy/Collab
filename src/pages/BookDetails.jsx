import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  BookmarkCheck, 
  BookOpen, 
  DollarSign, 
  Calendar, 
  Hash, 
  Tag, 
  Layers 
} from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import { useApp } from '../context/AppContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, deleteBook, issuedRecords } = useApp();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const bookId = parseInt(id, 10);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Book Not Found</h3>
        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0' }}>
          The requested book ID #{id} was not found in our catalog.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/books')}>
          Back to Books List
        </button>
      </div>
    );
  }

  const isAvailable = book.available_quantity > 0;
  
  // Find current issue history for this book
  const bookIssues = issuedRecords.filter(r => r.book_id === bookId);

  const handleDelete = () => {
    const success = deleteBook(bookId);
    if (success) {
      navigate('/books');
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div className="page-header-title">
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => navigate('/books')}
            style={{ marginBottom: '0.5rem' }}
          >
            <ArrowLeft size={16} /> Back to Books
          </button>
          <h2>{book.title}</h2>
          <p>By {book.author}</p>
        </div>

        {/* Actions Header Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(`/books/edit/${book.id}`)}
          >
            <Edit size={16} /> Edit
          </button>
          <button 
            className="btn btn-outline-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={16} /> Delete
          </button>
          <button 
            className="btn btn-primary"
            disabled={!isAvailable}
            onClick={() => navigate(`/issue-book?bookId=${book.id}`)}
            title={!isAvailable ? "Cannot issue book with 0 available copies" : "Issue copy to a borrower"}
          >
            <BookmarkCheck size={16} /> Issue Book
          </button>
        </div>
      </div>

      {/* Details Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Main Details Card */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Book Specifications</h3>
            <span className={`badge ${isAvailable ? 'badge-available' : 'badge-out_of_stock'}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
              {isAvailable ? `Available (${book.available_quantity} copies)` : 'Out of Stock (0 copies)'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Hash size={14} /> ISBN Number
              </span>
              <p style={{ fontWeight: 600, fontFamily: 'monospace', marginTop: '0.2rem' }}>{book.isbn}</p>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Tag size={14} /> Category
              </span>
              <p style={{ fontWeight: 600, marginTop: '0.2rem' }}>{book.category}</p>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <DollarSign size={14} /> Unit Price
              </span>
              <p style={{ fontWeight: 600, color: 'var(--primary)', marginTop: '0.2rem' }}>${parseFloat(book.price).toFixed(2)}</p>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Layers size={14} /> Total Copies
              </span>
              <p style={{ fontWeight: 600, marginTop: '0.2rem' }}>{book.quantity} copies ({book.available_quantity} free)</p>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} /> Published Date
              </span>
              <p style={{ fontWeight: 600, marginTop: '0.2rem' }}>{book.published_date || 'N/A'}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>Description & Overview</h4>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.9rem' }}>
              {book.description || 'No detailed description available for this book.'}
            </p>
          </div>
        </div>

        {/* Issue History Sidebar Card */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            Issuance History ({bookIssues.length})
          </h3>
          {bookIssues.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {bookIssues.map((issue) => (
                <div 
                  key={issue.id} 
                  style={{ 
                    padding: '0.75rem', 
                    borderRadius: 'var(--radius-sm)', 
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.875rem' }}>{issue.borrower_name}</strong>
                    <span className={`badge badge-${issue.status.toLowerCase().replace(/ /g, '_')}`}>
                      {issue.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Issued: {issue.issue_date} | Due: {issue.expected_return_date}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No borrow history records yet for this book.
            </p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Book"
        message={`Are you sure you want to delete "${book.title}" from the catalog?`}
        confirmText="Delete Book"
        confirmVariant="danger"
      />
    </div>
  );
};

export default BookDetails;
