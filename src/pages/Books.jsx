import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import BookTable from '../components/BookTable';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';

const Books = () => {
  const { books, deleteBook, globalSearch, setGlobalSearch } = useApp();
  const navigate = useNavigate();

  // Local state filters
  const [searchTerm, setSearchTerm] = useState(globalSearch || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Confirm delete modal state
  const [deletingBook, setDeletingBook] = useState(null);

  // Sync global search term from navbar if user types there
  React.useEffect(() => {
    if (globalSearch !== undefined) {
      setSearchTerm(globalSearch);
    }
  }, [globalSearch]);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setGlobalSearch(val);
    setCurrentPage(1);
  };

  // Derive unique categories from books
  const categories = useMemo(() => {
    const set = new Set(books.map(b => b.category).filter(Boolean));
    return Array.from(set);
  }, [books]);

  // Filtered Books calculation
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Search Title, Author, ISBN
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        !term ||
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.isbn.toLowerCase().includes(term);

      // Category filter
      const matchesCategory = !selectedCategory || book.category === selectedCategory;

      // Status filter
      const isAvailable = book.available_quantity > 0;
      const matchesStatus = 
        !selectedStatus ||
        (selectedStatus === 'Available' && isAvailable) ||
        (selectedStatus === 'Out of Stock' && !isAvailable);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [books, searchTerm, selectedCategory, selectedStatus]);

  // Paginated slices
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const currentBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage]);

  const handleDeleteConfirm = () => {
    if (deletingBook) {
      deleteBook(deletingBook.id);
      setDeletingBook(null);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title">
          <h2>Books Directory</h2>
          <p>Browse, filter, edit, or register new books in the library inventory.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/books/add')}>
          <Plus size={18} /> Add New Book
        </button>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="card filter-bar" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by title, author, or ISBN..."
        />
        <div className="filters-group">
          <FilterDropdown
            value={selectedCategory}
            onChange={(val) => {
              setSelectedCategory(val);
              setCurrentPage(1);
            }}
            options={categories}
            placeholder="All Categories"
          />
          <FilterDropdown
            value={selectedStatus}
            onChange={(val) => {
              setSelectedStatus(val);
              setCurrentPage(1);
            }}
            options={[
              { label: 'Available', value: 'Available' },
              { label: 'Out of Stock', value: 'Out of Stock' }
            ]}
            placeholder="All Statuses"
          />
        </div>
      </div>

      {/* Table / Content Area */}
      {filteredBooks.length > 0 ? (
        <div className="card" style={{ padding: 0 }}>
          <BookTable
            books={currentBooks}
            onDeleteInit={(book) => setDeletingBook(book)}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredBooks.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : (
        <div className="card">
          <EmptyState
            icon={BookOpen}
            title="No Books Found"
            description="We couldn't find any books matching your search or filter criteria."
            actionButton={
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setSearchTerm('');
                  setGlobalSearch('');
                  setSelectedCategory('');
                  setSelectedStatus('');
                }}
              >
                Clear Filters
              </button>
            }
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingBook)}
        onClose={() => setDeletingBook(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Book"
        message={`Are you sure you want to delete "${deletingBook?.title}"?`}
        confirmText="Delete Book"
        confirmVariant="danger"
      />
    </div>
  );
};

export default Books;
