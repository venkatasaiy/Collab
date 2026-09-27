import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Users, Mail, Phone, MapPin, BookOpen } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import BorrowerTable from '../components/BorrowerTable';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';
import BorrowerForm from '../components/BorrowerForm';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { useApp } from '../context/AppContext';

const Borrowers = () => {
  const { borrowers, deleteBorrower, updateBorrower, issuedRecords } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [viewingBorrower, setViewingBorrower] = useState(null);
  const [editingBorrower, setEditingBorrower] = useState(null);
  const [deletingBorrower, setDeletingBorrower] = useState(null);

  const filteredBorrowers = useMemo(() => {
    return borrowers.filter((b) => {
      const term = searchTerm.toLowerCase().trim();
      return (
        !term ||
        b.name.toLowerCase().includes(term) ||
        b.email.toLowerCase().includes(term) ||
        b.phone.toLowerCase().includes(term)
      );
    });
  }, [borrowers, searchTerm]);

  const totalPages = Math.ceil(filteredBorrowers.length / itemsPerPage);
  const currentBorrowers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBorrowers.slice(start, start + itemsPerPage);
  }, [filteredBorrowers, currentPage]);

  const handleDeleteConfirm = () => {
    if (deletingBorrower) {
      deleteBorrower(deletingBorrower.id);
      setDeletingBorrower(null);
    }
  };

  const handleEditSubmit = (formData) => {
    if (editingBorrower) {
      updateBorrower(editingBorrower.id, formData);
      setEditingBorrower(null);
    }
  };

  // Find books currently issued to viewing borrower
  const activeBorrowerIssues = viewingBorrower
    ? issuedRecords.filter(r => r.borrower_id === viewingBorrower.id && r.status !== 'Returned')
    : [];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-title">
          <h2>Borrowers Directory</h2>
          <p>Manage registered members, students, and active borrowing accounts.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/borrowers/add')}>
          <UserPlus size={18} /> Add New Borrower
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card filter-bar" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
        <SearchBar
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          placeholder="Search by borrower name, email, or phone number..."
        />
      </div>

      {/* Content / Table */}
      {filteredBorrowers.length > 0 ? (
        <div className="card" style={{ padding: 0 }}>
          <BorrowerTable
            borrowers={currentBorrowers}
            onView={(b) => setViewingBorrower(b)}
            onEdit={(b) => setEditingBorrower(b)}
            onDeleteInit={(b) => setDeletingBorrower(b)}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredBorrowers.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : (
        <div className="card">
          <EmptyState
            icon={Users}
            title="No Borrowers Found"
            description="No borrower profiles matched your search terms."
            actionButton={
              <button className="btn btn-secondary" onClick={() => setSearchTerm('')}>
                Clear Search
              </button>
            }
          />
        </div>
      )}

      {/* View Details Modal */}
      <Modal
        isOpen={Boolean(viewingBorrower)}
        onClose={() => setViewingBorrower(null)}
        title="Borrower Profile"
        footer={
          <button className="btn btn-secondary" onClick={() => setViewingBorrower(null)}>
            Close
          </button>
        }
      >
        {viewingBorrower && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div 
                style={{ 
                  width: '52px', 
                  height: '52px', 
                  borderRadius: '50%', 
                  background: 'var(--primary-light)', 
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {viewingBorrower.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{viewingBorrower.name}</h3>
                <span className="badge badge-available">ID #{viewingBorrower.id}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem' }}>
                <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{viewingBorrower.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem' }}>
                <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{viewingBorrower.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
                <MapPin size={16} style={{ color: 'var(--text-muted)', marginTop: '2px' }} />
                <span>{viewingBorrower.address || 'No address provided'}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <BookOpen size={16} /> Active Issued Books ({activeBorrowerIssues.length})
              </h4>
              {activeBorrowerIssues.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {activeBorrowerIssues.map(issue => (
                    <li key={issue.id} style={{ fontSize: '0.85rem', background: 'var(--bg-app)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      <strong>{issue.book_title}</strong> (Due: {issue.expected_return_date})
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  This borrower currently has no unreturned books.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={Boolean(editingBorrower)}
        onClose={() => setEditingBorrower(null)}
        title={`Edit Borrower: ${editingBorrower?.name || ''}`}
      >
        {editingBorrower && (
          <BorrowerForm
            initialValues={editingBorrower}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingBorrower(null)}
            isEditing={true}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingBorrower)}
        onClose={() => setDeletingBorrower(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Borrower"
        message={`Are you sure you want to remove "${deletingBorrower?.name}" from borrowers?`}
        confirmText="Delete Borrower"
        confirmVariant="danger"
      />
    </div>
  );
};

export default Borrowers;
