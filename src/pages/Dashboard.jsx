import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  CheckCircle2, 
  BookmarkCheck, 
  Users, 
  BookPlus, 
  UserPlus, 
  Eye, 
  ArrowRight,
  Clock,
  RotateCcw
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
  const { books, borrowers, issuedRecords, resetToMockData } = useApp();
  const navigate = useNavigate();

  // Statistics Calculations
  const totalBooks = books.length;
  const availableBooks = books.reduce((acc, b) => acc + (b.available_quantity || 0), 0);
  const activeIssuedBooks = issuedRecords.filter(r => r.status !== 'Returned').length;
  const totalBorrowers = borrowers.length;

  // Recent 5 items
  const recentBooks = [...books].slice(0, 5);
  const recentIssues = [...issuedRecords].slice(0, 5);

  return (
    <div>
      {/* Welcome Banner */}
      <div 
        className="card" 
        style={{ 
          marginBottom: '1.75rem', 
          background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)', 
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Welcome to Library Management System
          </h2>
          <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>
            Monitor key metrics, issue books, and manage your collection efficiently.
          </p>
        </div>
        <button 
          className="btn" 
          onClick={resetToMockData}
          style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.3)' }}
          title="Reset mock data to initial state"
        >
          <RotateCcw size={16} /> Reset Demo Data
        </button>
      </div>

      {/* Statistics Cards Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Books"
          value={totalBooks}
          icon={BookOpen}
          color="var(--primary)"
          bgColor="var(--primary-light)"
        />
        <StatCard
          title="Available Copies"
          value={availableBooks}
          icon={CheckCircle2}
          color="var(--success)"
          bgColor="var(--success-bg)"
        />
        <StatCard
          title="Issued Books"
          value={activeIssuedBooks}
          icon={BookmarkCheck}
          color="var(--warning)"
          bgColor="var(--warning-bg)"
        />
        <StatCard
          title="Total Borrowers"
          value={totalBorrowers}
          icon={Users}
          color="var(--info)"
          bgColor="var(--info-bg)"
        />
      </div>

      {/* Quick Actions Panel */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/books/add')}
            style={{ padding: '0.85rem', justifyContent: 'flex-start' }}
          >
            <BookPlus size={20} style={{ color: 'var(--primary)' }} />
            <span>Add Book</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/books')}
            style={{ padding: '0.85rem', justifyContent: 'flex-start' }}
          >
            <BookOpen size={20} style={{ color: 'var(--info)' }} />
            <span>View Books</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/issue-book')}
            style={{ padding: '0.85rem', justifyContent: 'flex-start' }}
          >
            <BookmarkCheck size={20} style={{ color: 'var(--warning)' }} />
            <span>Issue Book</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/borrowers')}
            style={{ padding: '0.85rem', justifyContent: 'flex-start' }}
          >
            <Users size={20} style={{ color: 'var(--success)' }} />
            <span>View Borrowers</span>
          </button>
        </div>
      </div>

      {/* Recent Activity Sections Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Recently Added Books */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recently Added Books</h3>
            <button 
              className="btn btn-sm btn-secondary" 
              onClick={() => navigate('/books')}
              style={{ fontSize: '0.8rem' }}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBooks.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong 
                        style={{ color: 'var(--primary)', cursor: 'pointer' }}
                        onClick={() => navigate(`/books/${b.id}`)}
                      >
                        {b.title}
                      </strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.author}</div>
                    </td>
                    <td>{b.category}</td>
                    <td>
                      <span className={`badge ${b.available_quantity > 0 ? 'badge-available' : 'badge-out_of_stock'}`}>
                        {b.available_quantity > 0 ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recently Issued Books */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recently Issued Books</h3>
            <button 
              className="btn btn-sm btn-secondary" 
              onClick={() => navigate('/issued-books')}
              style={{ fontSize: '0.8rem' }}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Borrower</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentIssues.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.book_title}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Return by {r.expected_return_date}</div>
                    </td>
                    <td>{r.borrower_name}</td>
                    <td>
                      <span className={`badge badge-${r.status.toLowerCase().replace(/ /g, '_')}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
