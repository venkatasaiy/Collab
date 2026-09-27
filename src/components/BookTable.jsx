import React from 'react';
import { Eye, Edit, Trash2, BookPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookTable = ({ books = [], onDeleteInit }) => {
  const navigate = useNavigate();

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Book Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => {
            const isAvailable = book.available_quantity > 0;
            const statusClass = isAvailable ? 'badge-available' : 'badge-out_of_stock';
            const statusText = isAvailable ? 'Available' : 'Out of Stock';

            return (
              <tr key={book.id}>
                <td>#{book.id}</td>
                <td>
                  <strong 
                    style={{ cursor: 'pointer', color: 'var(--primary)' }}
                    onClick={() => navigate(`/books/${book.id}`)}
                  >
                    {book.title}
                  </strong>
                </td>
                <td>{book.author}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{book.isbn}</td>
                <td>
                  <span 
                    style={{ 
                      background: 'var(--bg-app)', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 500
                    }}
                  >
                    {book.category}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>${parseFloat(book.price).toFixed(2)}</td>
                <td>
                  <span>{book.available_quantity}</span> / <span style={{ color: 'var(--text-muted)' }}>{book.quantity}</span>
                </td>
                <td>
                  <span className={`badge ${statusClass}`}>
                    {statusText}
                  </span>
                </td>
                <td>
                  <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                    <button
                      className="action-btn view"
                      title="View Details"
                      onClick={() => navigate(`/books/${book.id}`)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="action-btn edit"
                      title="Edit Book"
                      onClick={() => navigate(`/books/edit/${book.id}`)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="action-btn delete"
                      title="Delete Book"
                      onClick={() => onDeleteInit(book)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
