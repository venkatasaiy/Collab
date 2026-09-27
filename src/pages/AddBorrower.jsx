import React from 'react';
import { useNavigate } from 'react-router-dom';
import BorrowerForm from '../components/BorrowerForm';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';

const AddBorrower = () => {
  const { addBorrower } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    addBorrower(formData);
    navigate('/borrowers');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-title">
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => navigate('/borrowers')}
            style={{ marginBottom: '0.5rem' }}
          >
            <ArrowLeft size={16} /> Back to Borrowers
          </button>
          <h2>Add New Borrower</h2>
          <p>Register a new borrower profile in the system database.</p>
        </div>
      </div>

      <BorrowerForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/borrowers')}
        isEditing={false}
      />
    </div>
  );
};

export default AddBorrower;
