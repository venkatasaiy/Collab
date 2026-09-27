import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialBooks, initialBorrowers, initialIssueRecords } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('bms_user');
    return savedUser ? JSON.parse(savedUser) : { username: 'admin', email: 'admin@library.com', name: 'Admin User' };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('bms_auth') === 'true';
  });

  // Books State
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('bms_books');
    return saved ? JSON.parse(saved) : initialBooks;
  });

  // Borrowers State
  const [borrowers, setBorrowers] = useState(() => {
    const saved = localStorage.getItem('bms_borrowers');
    return saved ? JSON.parse(saved) : initialBorrowers;
  });

  // Issued Books State
  const [issuedRecords, setIssuedRecords] = useState(() => {
    const saved = localStorage.getItem('bms_issued_records');
    return saved ? JSON.parse(saved) : initialIssueRecords;
  });

  // Theme State ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('bms_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch (e) {
      return 'light';
    }
  });

  // Global Toast Notification State
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success', // 'success' | 'error' | 'info' | 'warning'
  });

  // Global Search term in Navbar
  const [globalSearch, setGlobalSearch] = useState('');

  // Apply & Persist Theme
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('bms_theme', theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Persist Data to LocalStorage
  useEffect(() => {
    localStorage.setItem('bms_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('bms_borrowers', JSON.stringify(borrowers));
  }, [borrowers]);

  useEffect(() => {
    localStorage.setItem('bms_issued_records', JSON.stringify(issuedRecords));
  }, [issuedRecords]);

  useEffect(() => {
    localStorage.setItem('bms_auth', isAuthenticated ? 'true' : 'false');
    if (user) {
      localStorage.setItem('bms_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bms_user');
    }
  }, [isAuthenticated, user]);

  // Toast Function
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Auth Operations
  const login = (usernameOrEmail, password, remember = false) => {
    if (!usernameOrEmail || !password) {
      showToast('Please enter both username/email and password.', 'error');
      return false;
    }
    // Simple mock validation
    const mockUser = {
      username: usernameOrEmail,
      email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@library.com`,
      name: 'Library Administrator',
      role: 'Head Librarian',
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    if (remember) {
      localStorage.setItem('bms_remembered_user', usernameOrEmail);
    } else {
      localStorage.removeItem('bms_remembered_user');
    }
    showToast('Login successful! Welcome back.', 'success');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('You have been logged out.', 'info');
  };

  // Book CRUD Functions
  const addBook = (bookData) => {
    const qty = parseInt(bookData.quantity, 10) || 1;
    const price = parseFloat(bookData.price) || 0;
    const newBook = {
      ...bookData,
      id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
      price: price,
      quantity: qty,
      available_quantity: qty,
      status: qty > 0 ? 'Available' : 'Out of Stock',
    };
    setBooks(prev => [newBook, ...prev]);
    showToast(`Book "${newBook.title}" added successfully!`, 'success');
    return newBook;
  };

  const updateBook = (id, bookData) => {
    const numericId = parseInt(id, 10);
    const existing = books.find(b => b.id === numericId);
    if (!existing) {
      showToast('Book not found.', 'error');
      return false;
    }

    const qty = parseInt(bookData.quantity, 10) || existing.quantity;
    const qtyDiff = qty - existing.quantity;
    const newAvailable = Math.max(0, existing.available_quantity + qtyDiff);
    const price = parseFloat(bookData.price) || existing.price;

    const updatedBook = {
      ...existing,
      ...bookData,
      id: numericId,
      price: price,
      quantity: qty,
      available_quantity: newAvailable,
      status: newAvailable > 0 ? 'Available' : 'Out of Stock',
    };

    setBooks(prev => prev.map(b => b.id === numericId ? updatedBook : b));
    showToast(`Book "${updatedBook.title}" updated successfully!`, 'success');
    return true;
  };

  const deleteBook = (id) => {
    const numericId = parseInt(id, 10);
    const activeIssue = issuedRecords.some(r => r.book_id === numericId && r.status !== 'Returned');
    if (activeIssue) {
      showToast('Cannot delete a book that is currently issued to a borrower.', 'error');
      return false;
    }

    const target = books.find(b => b.id === numericId);
    setBooks(prev => prev.filter(b => b.id !== numericId));
    showToast(`Book "${target?.title || 'Book'}" deleted successfully.`, 'info');
    return true;
  };

  // Borrower CRUD Functions
  const addBorrower = (borrowerData) => {
    const newBorrower = {
      ...borrowerData,
      id: borrowers.length > 0 ? Math.max(...borrowers.map(b => b.id)) + 1 : 1,
      issued_books_count: 0,
    };
    setBorrowers(prev => [newBorrower, ...prev]);
    showToast(`Borrower "${newBorrower.name}" registered successfully!`, 'success');
    return newBorrower;
  };

  const updateBorrower = (id, borrowerData) => {
    const numericId = parseInt(id, 10);
    const existing = borrowers.find(b => b.id === numericId);
    if (!existing) {
      showToast('Borrower not found.', 'error');
      return false;
    }

    const updated = {
      ...existing,
      ...borrowerData,
      id: numericId,
    };

    setBorrowers(prev => prev.map(b => b.id === numericId ? updated : b));
    showToast(`Borrower profile for "${updated.name}" updated!`, 'success');
    return true;
  };

  const deleteBorrower = (id) => {
    const numericId = parseInt(id, 10);
    const hasActiveBooks = issuedRecords.some(r => r.borrower_id === numericId && r.status !== 'Returned');
    if (hasActiveBooks) {
      showToast('Cannot delete borrower with active unreturned books.', 'error');
      return false;
    }

    const target = borrowers.find(b => b.id === numericId);
    setBorrowers(prev => prev.filter(b => b.id !== numericId));
    showToast(`Borrower "${target?.name || 'Borrower'}" removed.`, 'info');
    return true;
  };

  // Issue Book Functionality
  const issueBook = ({ book_id, borrower_id, issue_date, expected_return_date }) => {
    const bookIdNum = parseInt(book_id, 10);
    const borrowerIdNum = parseInt(borrower_id, 10);

    const targetBook = books.find(b => b.id === bookIdNum);
    const targetBorrower = borrowers.find(b => b.id === borrowerIdNum);

    if (!targetBook) {
      showToast('Selected book was not found.', 'error');
      return { success: false, error: 'Book not found' };
    }

    if (!targetBorrower) {
      showToast('Selected borrower was not found.', 'error');
      return { success: false, error: 'Borrower not found' };
    }

    // BUSINESS RULE: Do not allow issuing a book when quantity is 0
    if (targetBook.available_quantity <= 0) {
      showToast(`Cannot issue "${targetBook.title}". Out of available copies!`, 'error');
      return { success: false, error: 'Book is out of stock' };
    }

    // Create Issue Record
    const newRecord = {
      id: issuedRecords.length > 0 ? Math.max(...issuedRecords.map(r => r.id)) + 1 : 1,
      book_id: bookIdNum,
      book_title: targetBook.title,
      borrower_id: borrowerIdNum,
      borrower_name: targetBorrower.name,
      issue_date: issue_date || new Date().toISOString().split('T')[0],
      expected_return_date: expected_return_date,
      return_date: null,
      status: 'Issued',
    };

    // Update Book stock
    const newAvail = targetBook.available_quantity - 1;
    setBooks(prev => prev.map(b => {
      if (b.id === bookIdNum) {
        return {
          ...b,
          available_quantity: newAvail,
          status: newAvail > 0 ? 'Available' : 'Out of Stock',
        };
      }
      return b;
    }));

    // Update Borrower's count
    setBorrowers(prev => prev.map(b => {
      if (b.id === borrowerIdNum) {
        return { ...b, issued_books_count: (b.issued_books_count || 0) + 1 };
      }
      return b;
    }));

    // Add to records
    setIssuedRecords(prev => [newRecord, ...prev]);

    showToast(`Book "${targetBook.title}" successfully issued to ${targetBorrower.name}!`, 'success');
    return { success: true, record: newRecord };
  };

  // Return Book Functionality
  const returnBook = (issueId) => {
    const recordIdNum = parseInt(issueId, 10);
    const record = issuedRecords.find(r => r.id === recordIdNum);

    if (!record) {
      showToast('Issue record not found.', 'error');
      return false;
    }

    if (record.status === 'Returned') {
      showToast('This book has already been returned.', 'info');
      return false;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Update Record Status
    setIssuedRecords(prev => prev.map(r => {
      if (r.id === recordIdNum) {
        return {
          ...r,
          status: 'Returned',
          return_date: todayStr,
        };
      }
      return r;
    }));

    // Increase Book available quantity
    setBooks(prev => prev.map(b => {
      if (b.id === record.book_id) {
        const updatedAvail = b.available_quantity + 1;
        return {
          ...b,
          available_quantity: updatedAvail,
          status: updatedAvail > 0 ? 'Available' : 'Out of Stock',
        };
      }
      return b;
    }));

    // Decrease Borrower issued count
    setBorrowers(prev => prev.map(b => {
      if (b.id === record.borrower_id) {
        return {
          ...b,
          issued_books_count: Math.max(0, (b.issued_books_count || 1) - 1),
        };
      }
      return b;
    }));

    showToast(`Book "${record.book_title}" has been returned!`, 'success');
    return true;
  };

  // Helper to reset data back to initial mock values
  const resetToMockData = () => {
    setBooks(initialBooks);
    setBorrowers(initialBorrowers);
    setIssuedRecords(initialIssueRecords);
    showToast('Reset system data to initial default mock values.', 'info');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    books,
    addBook,
    updateBook,
    deleteBook,
    borrowers,
    addBorrower,
    updateBorrower,
    deleteBorrower,
    issuedRecords,
    issueBook,
    returnBook,
    toast,
    showToast,
    hideToast,
    globalSearch,
    setGlobalSearch,
    resetToMockData,
    theme,
    setTheme,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
