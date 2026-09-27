import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkCheck, RotateCcw, Plus, CheckCircle } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';

const IssuedBooks = () => {
  const { issuedRecords, returnBook } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredRecords = useMemo(() => {
    return issuedRecords.filter((record) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        !term ||
        record.book_title.toLowerCase().includes(term) ||
        record.borrower_name.toLowerCase().includes(term);

      const matchesStatus = !selectedStatus || record.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [issuedRecords, searchTerm, selectedStatus]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  const handleReturn = (issueId) => {
    returnBook(issueId);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title">
          <h2>Issued Books Log</h2>
          <p>Track actively borrowed books, return dates, overdue records, and returns.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/issue-book')}>
          <Plus size={18} /> Issue New Book
        </button>
      </div>

      {/* Filters Bar */}
      <div className="card filter-bar" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
        <SearchBar
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          placeholder="Search by book title or borrower name..."
        />
        <div className="filters-group">
          <FilterDropdown
            value={selectedStatus}
            onChange={(val) => {
              setSelectedStatus(val);
              setCurrentPage(1);
            }}
            options={[
              { label: 'Issued', value: 'Issued' },
              { label: 'Returned', value: 'Returned' },
              { label: 'Overdue', value: 'Overdue' }
            ]}
            placeholder="All Statuses"
          />
        </div>
      </div>

      {/* Table Section */}
      {filteredRecords.length > 0 ? (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Issue ID</th>
                  <th>Book Title</th>
                  <th>Borrower</th>
                  <th>Issue Date</th>
                  <th>Expected Return</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record) => {
                  const isReturned = record.status === 'Returned';
                  const badgeClass = `badge badge-${record.status.toLowerCase().replace(/ /g, '_')}`;

                  return (
                    <tr key={record.id}>
                      <td>#{record.id}</td>
                      <td>
                        <strong 
                          style={{ cursor: 'pointer', color: 'var(--primary)' }}
                          onClick={() => navigate(`/books/${record.book_id}`)}
                        >
                          {record.book_title}
                        </strong>
                      </td>
                      <td style={{ fontWeight: 500 }}>{record.borrower_name}</td>
                      <td>{record.issue_date}</td>
                      <td>{record.expected_return_date}</td>
                      <td>{record.return_date ? record.return_date : '—'}</td>
                      <td>
                        <span className={badgeClass}>
                          {record.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                          {!isReturned ? (
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleReturn(record.id)}
                              title="Mark book as returned"
                              style={{ color: 'var(--success-text)', borderColor: 'var(--success)' }}
                            >
                              <RotateCcw size={14} /> Return Book
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <CheckCircle size={14} style={{ color: 'var(--success)' }} /> Returned
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredRecords.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : (
        <div className="card">
          <EmptyState
            icon={BookmarkCheck}
            title="No Issued Records Found"
            description="No book borrowing records matched your filter criteria."
            actionButton={
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('');
                }}
              >
                Clear Filters
              </button>
            }
          />
        </div>
      )}
    </div>
  );
};

export default IssuedBooks;
