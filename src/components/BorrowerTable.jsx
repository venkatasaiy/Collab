import React from 'react';
import { Eye, Edit, Trash2, BookOpen } from 'lucide-react';

const BorrowerTable = ({ borrowers = [], onView, onEdit, onDeleteInit }) => {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Books Issued</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {borrowers.map((borrower) => (
            <tr key={borrower.id}>
              <td>#{borrower.id}</td>
              <td style={{ fontWeight: 600 }}>{borrower.name}</td>
              <td style={{ color: 'var(--text-muted)' }}>{borrower.email}</td>
              <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{borrower.phone}</td>
              <td>
                <span 
                  className={`badge ${borrower.issued_books_count > 0 ? 'badge-issued' : 'badge-available'}`}
                  style={{ gap: '0.35rem' }}
                >
                  <BookOpen size={12} />
                  {borrower.issued_books_count || 0} Books
                </span>
              </td>
              <td>
                <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                  <button
                    className="action-btn view"
                    title="View Borrower Info"
                    onClick={() => onView(borrower)}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="action-btn edit"
                    title="Edit Borrower"
                    onClick={() => onEdit(borrower)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="action-btn delete"
                    title="Delete Borrower"
                    onClick={() => onDeleteInit(borrower)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowerTable;
