import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookmarkCheck, AlertCircle, ArrowLeft, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

const IssueBook = () => {
  const { books, borrowers, issueBook, showToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectedBookId = searchParams.get('bookId') || '';

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultReturn = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    book_id: preselectedBookId,
    borrower_id: '',
    issue_date: todayStr,
    expected_return_date: defaultReturn,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (preselectedBookId) {
      setFormData(prev => ({ ...prev, book_id: preselectedBookId }));
    }
  }, [preselectedBookId]);

  const selectedBook = books.find(b => b.id === parseInt(formData.book_id, 10));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.book_id) {
      errs.book_id = 'Please select a book';
    } else if (selectedBook && selectedBook.available_quantity <= 0) {
      errs.book_id = 'This book is currently out of stock and cannot be issued!';
    }

    if (!formData.borrower_id) {
      errs.borrower_id = 'Please select a borrower';
    }

    if (!formData.issue_date) {
      errs.issue_date = 'Issue date is required';
    }

    if (!formData.expected_return_date) {
      errs.expected_return_date = 'Expected return date is required';
    } else if (new Date(formData.expected_return_date) < new Date(formData.issue_date)) {
      errs.expected_return_date = 'Return date cannot be earlier than issue date';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const res = issueBook(formData);
      if (res.success) {
        navigate('/issued-books');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-title">
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => navigate('/issued-books')}
            style={{ marginBottom: '0.5rem' }}
          >
            <ArrowLeft size={16} /> Back to Issued Records
          </button>
          <h2>Issue Book to Borrower</h2>
          <p>Assign a library book copy to a registered borrower.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card form-card">
        <div className="form-grid">
          {/* Select Book */}
          <div className="form-group full-width">
            <label htmlFor="book_id">Select Book *</label>
            <select
              id="book_id"
              name="book_id"
              className="form-control"
              value={formData.book_id}
              onChange={handleChange}
            >
              <option value="">-- Choose a Book --</option>
              {books.map((b) => (
                <option 
                  key={b.id} 
                  value={b.id} 
                  disabled={b.available_quantity <= 0}
                >
                  {b.title} ({b.author}) — {b.available_quantity > 0 ? `${b.available_quantity} copies available` : 'OUT OF STOCK'}
                </option>
              ))}
            </select>
            {errors.book_id && <span className="error-text">{errors.book_id}</span>}

            {selectedBook && (
              <div 
                style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.65rem 0.85rem', 
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: selectedBook.available_quantity > 0 ? 'var(--info-bg)' : 'var(--danger-bg)',
                  color: selectedBook.available_quantity > 0 ? 'var(--info-text)' : 'var(--danger-text)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <AlertCircle size={16} />
                <span>
                  <strong>{selectedBook.title}</strong>: {selectedBook.available_quantity} of {selectedBook.quantity} total copies currently available.
                </span>
              </div>
            )}
          </div>

          {/* Select Borrower */}
          <div className="form-group full-width">
            <label htmlFor="borrower_id">Select Borrower *</label>
            <select
              id="borrower_id"
              name="borrower_id"
              className="form-control"
              value={formData.borrower_id}
              onChange={handleChange}
            >
              <option value="">-- Choose a Borrower --</option>
              {borrowers.map((br) => (
                <option key={br.id} value={br.id}>
                  {br.name} ({br.email}) — Currently has {br.issued_books_count || 0} books
                </option>
              ))}
            </select>
            {errors.borrower_id && <span className="error-text">{errors.borrower_id}</span>}
          </div>

          {/* Issue Date */}
          <div className="form-group">
            <label htmlFor="issue_date">Issue Date *</label>
            <input
              type="date"
              id="issue_date"
              name="issue_date"
              className="form-control"
              value={formData.issue_date}
              onChange={handleChange}
            />
            {errors.issue_date && <span className="error-text">{errors.issue_date}</span>}
          </div>

          {/* Expected Return Date */}
          <div className="form-group">
            <label htmlFor="expected_return_date">Expected Return Date *</label>
            <input
              type="date"
              id="expected_return_date"
              name="expected_return_date"
              className="form-control"
              value={formData.expected_return_date}
              onChange={handleChange}
            />
            {errors.expected_return_date && <span className="error-text">{errors.expected_return_date}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate('/issued-books')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={selectedBook && selectedBook.available_quantity <= 0}
          >
            <BookmarkCheck size={18} /> Confirm & Issue Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueBook;
