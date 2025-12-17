// import { useEffect, useState } from 'react';
// import api from '../services/api';
// import './Accounts.css';

// const Accounts = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showRoleModal, setShowRoleModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
// const [deleting, setDeleting] = useState(false);
// const [deleteError, setDeleteError] = useState('');
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [newAccountForm, setNewAccountForm] = useState({
//     name: '',
//     password: '',
//     role: 'USER',
//   });
//   const [creating, setCreating] = useState(false);
//   const [updatingRole, setUpdatingRole] = useState(false);
//   const [roleError, setRoleError] = useState('');
//   const [createError, setCreateError] = useState('');

//   // Get current user info
//   const userRole = localStorage.getItem("user_role") || "Medical Staff";
//   const userName = localStorage.getItem("user_name") || "";
//   const isAdmin = userRole === "ADMIN" || userRole === "admin";

//   useEffect(() => {
//     if (isAdmin) {
//       fetchAccounts();
//     }
//   }, [isAdmin]);

//   const fetchAccounts = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get('/auth/users');
//       setAccounts(response.data || []);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching accounts:', err);
//       setError('Failed to load accounts. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//       });
//     } catch (e) {
//       return 'Invalid date';
//     }
//   };

//   const handleAddAccount = async () => {
//     // Validate form
//     if (!newAccountForm.name.trim()) {
//       setCreateError('Username is required');
//       return;
//     }

//     if (!newAccountForm.password.trim()) {
//       setCreateError('Password is required');
//       return;
//     }

//     if (newAccountForm.password.length < 3) {
//       setCreateError('Password must be at least 3 characters');
//       return;
//     }

//     try {
//       setCreating(true);
//       setCreateError('');

//       const accountData = {
//         name: newAccountForm.name.trim(),
//         password: newAccountForm.password,
//         role: newAccountForm.role,
//       };

//       const response = await api.post('/auth/register', accountData);

//       // Add new account to list
//       setAccounts(prev => [response.data, ...prev]);

//       // Close modal and reset form
//       setShowAddModal(false);
//       resetNewAccountForm();

//       alert('Account created successfully!');
//     } catch (err) {
//       console.error('Error creating account:', err);
//       setCreateError(
//         err.response?.data?.message || 
//         err.response?.data?.error || 
//         'Failed to create account. Please try again.'
//       );
//     } finally {
//       setCreating(false);
//     }
//   };

//   const handleDeleteAccount = async () => {
//   if (!selectedUser) return;

//   // Prevent deleting yourself
//   if (selectedUser.name === userName) {
//     setDeleteError('You cannot delete your own account');
//     return;
//   }

//   try {
//     setDeleting(true);
//     setDeleteError('');

//     await api.delete(`/auth/users/${selectedUser.id}`);

//     // Remove account from the list
//     setAccounts(prev => prev.filter(account => account.id !== selectedUser.id));

//     // Close modal
//     setShowDeleteModal(false);
//     setSelectedUser(null);
    
//     alert('Account deleted successfully!');
//   } catch (err) {
//     console.error('Error deleting account:', err);
//     setDeleteError(
//       err.response?.data?.message || 
//       'Failed to delete account. Please try again.'
//     );
//   } finally {
//     setDeleting(false);
//   }
// };

//   const handleUpdateRole = async (newRole) => {
//     if (!selectedUser) return;

//     try {
//       setUpdatingRole(true);
//       setRoleError('');

//       const response = await api.patch(`/auth/users/${selectedUser.id}/role`, {
//         role: newRole,
//       });

//       // Update the account in the local state
//       setAccounts(prev =>
//         prev.map(account =>
//           account.id === selectedUser.id ? response.data : account
//         )
//       );

//       setShowRoleModal(false);
//       setSelectedUser(null);
      
//       alert(`Role updated to ${newRole} successfully!`);
//     } catch (err) {
//       console.error('Error updating role:', err);
//       setRoleError(
//         err.response?.data?.message || 
//         'Failed to update role. Please try again.'
//       );
//     } finally {
//       setUpdatingRole(false);
//     }
//   };

//   const resetNewAccountForm = () => {
//     setNewAccountForm({
//       name: '',
//       password: '',
//       role: 'USER',
//     });
//     setCreateError('');
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewAccountForm(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   if (!isAdmin) {
//     return (
//       <div className="accounts-page">
//         <div className="page-header">
//           <h1 className="page-title">Accounts</h1>
//           <p className="page-subtitle">Manage medical staff accounts and permissions</p>
//         </div>
//         <div className="access-denied">
//           <h3>Access Denied</h3>
//           <p>Only administrators can access this page.</p>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="accounts-page">
//         <div className="page-header">
//           <h1 className="page-title">Accounts</h1>
//           <p className="page-subtitle">Manage medical staff accounts and permissions</p>
//         </div>
//         <div className="loading-state">
//           <p>Loading accounts...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="accounts-page">
//         <div className="page-header">
//           <h1 className="page-title">Accounts</h1>
//           <p className="page-subtitle">Manage medical staff accounts and permissions</p>
//         </div>
//         <div className="error-state">
//           <p>{error}</p>
//           <button onClick={fetchAccounts} className="btn btn-secondary">
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//  return (
//   <div className="accounts-page">
//     <div className="page-header">
//       <div className="header-left">
//         <h1 className="page-title">Accounts</h1>
//         <p className="page-subtitle">Manage medical staff accounts and permissions</p>
//       </div>
//       <div className="header-actions">
//         <button
//           className="btn btn-primary"
//           onClick={() => setShowAddModal(true)}
//         >
//           + New Account
//         </button>
//         {/* <div className="user-info-badge">
//           <span className="user-role">{userRole}</span>
//           <span className="user-name">{userName}</span>
//         </div> */}
//       </div>
//     </div>

//     <div className="accounts-grid">
//       {accounts.map((account) => (
//         <div key={account.id} className="account-card">
//           <div className="account-header">
//             <div className="account-title">
//               <h3 className="account-name">{account.name}</h3>
//               <span className={`account-role ${account.role === 'ADMIN' ? 'role-admin' : 'role-user'}`}>
//                 {account.role}
//               </span>
//             </div>
//             <div className="status-badge status-active">
//               Active
//             </div>
//           </div>

//           <div className="account-details">
//             <div className="detail-item">
//               <span className="detail-label">Username</span>
//               <span className="detail-value">{account.name}</span>
//             </div>

//             <div className="detail-item">
//               <span className="detail-label">Role</span>
//               <span className={`detail-value role ${account.role === 'ADMIN' ? 'role-admin' : 'role-user'}`}>
//                 {account.role}
//               </span>
//             </div>
//           </div>

//           <div className="account-actions">
//             <button 
//               className="btn btn-secondary"
//               onClick={() => {
//                 setSelectedUser(account);
//                 setShowDeleteModal(true);
//                 setDeleteError('');
//               }}
//               disabled={account.name === userName}
//               title={account.name === userName ? "Cannot delete your own account" : "Delete account"}
//             >
//               Delete
//             </button>
//             <button 
//               className="btn btn-primary"
//               onClick={() => {
//                 setSelectedUser(account);
//                 setShowRoleModal(true);
//                 setRoleError('');
//               }}
//             >
//               Change Role
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>

//     {accounts.length === 0 && !loading && (
//       <div className="empty-state">
//         <p>No accounts found in the system.</p>
//         <button 
//           className="btn btn-primary"
//           onClick={() => setShowAddModal(true)}
//         >
//           Create First Account
//         </button>
//       </div>
//     )}

//     {/* Add Account Modal */}
//     {showAddModal && (
//       <div className="modal-overlay">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h2>Create New Account</h2>
//             <button
//               className="modal-close"
//               onClick={() => {
//                 setShowAddModal(false);
//                 resetNewAccountForm();
//               }}
//             >
//               ×
//             </button>
//           </div>

//           <div className="modal-body">
//             {createError && (
//               <div className="error-message">{createError}</div>
//             )}

//             <div className="new-account-form">
//               <div className="form-group">
//                 <label htmlFor="name">
//                   Username <span className="required-indicator">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={newAccountForm.name}
//                   onChange={handleInputChange}
//                   placeholder="Enter username"
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="password">
//                   Password <span className="required-indicator">*</span>
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   value={newAccountForm.password}
//                   onChange={handleInputChange}
//                   placeholder="Enter password (min 3 characters)"
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="role">Role</label>
//                 <select
//                   id="role"
//                   name="role"
//                   value={newAccountForm.role}
//                   onChange={handleInputChange}
//                 >
//                   <option value="USER">User</option>
//                   <option value="ADMIN">Administrator</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="modal-footer">
//             <button
//               className="btn btn-secondary"
//               onClick={() => {
//                 setShowAddModal(false);
//                 resetNewAccountForm();
//               }}
//               disabled={creating}
//             >
//               Cancel
//             </button>
//             <button
//               className="btn btn-primary"
//               onClick={handleAddAccount}
//               disabled={creating || !newAccountForm.name || !newAccountForm.password}
//             >
//               {creating ? "Creating..." : "Create Account"}
//             </button>
//           </div>
//         </div>
//       </div>
//     )}

//     {/* Change Role Modal */}
//     {showRoleModal && selectedUser && (
//       <div className="modal-overlay">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h2>Change Role for {selectedUser.name}</h2>
//             <button
//               className="modal-close"
//               onClick={() => {
//                 setShowRoleModal(false);
//                 setSelectedUser(null);
//                 setRoleError('');
//               }}
//             >
//               ×
//             </button>
//           </div>

//           <div className="modal-body">
//             {roleError && (
//               <div className="error-message">{roleError}</div>
//             )}

//             <div className="current-role-info">
//               <p>Current Role: <strong>{selectedUser.role}</strong></p>
//               <p>Select new role:</p>
//             </div>

//             <div className="role-options">
//               <button
//                 className={`role-option ${selectedUser.role === 'USER' ? 'selected' : ''}`}
//                 onClick={() => handleUpdateRole('USER')}
//                 disabled={updatingRole}
//               >
//                 <div className="role-title">User</div>
//                 <div className="role-description">
//                   Can view and create
//                 </div>
//               </button>

//               <button
//                 className={`role-option ${selectedUser.role === 'ADMIN' ? 'selected' : ''}`}
//                 onClick={() => handleUpdateRole('ADMIN')}
//                 disabled={updatingRole}
//               >
//                 <div className="role-title">Administrator</div>
//                 <div className="role-description">
//                   Full system access 
//                 </div>
//               </button>
//             </div>
//           </div>

//           <div className="modal-footer">
//             <button
//               className="btn btn-secondary"
//               onClick={() => {
//                 setShowRoleModal(false);
//                 setSelectedUser(null);
//                 setRoleError('');
//               }}
//               disabled={updatingRole}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     )}

//     {/* Delete Account Modal */}
//     {showDeleteModal && selectedUser && (
//       <div className="modal-overlay">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h2>Delete Account</h2>
//             <button
//               className="modal-close"
//               onClick={() => {
//                 setShowDeleteModal(false);
//                 setSelectedUser(null);
//                 setDeleteError('');
//               }}
//             >
//               ×
//             </button>
//           </div>

//           <div className="modal-body">
//             {deleteError && (
//               <div className="error-message">{deleteError}</div>
//             )}

//             <div className="delete-confirmation">
//               <div className="warning-icon">⚠️</div>
//               <h3>Are you sure?</h3>
//               <p>
//                 You are about to delete the account for <strong>{selectedUser.name}</strong>.
//                 This action cannot be undone.
//               </p>
              
//               <div className="user-details-preview">
//                 <div className="detail-row">
//                   <span className="detail-label">Username:</span>
//                   <span className="detail-value">{selectedUser.name}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="detail-label">Role:</span>
//                   <span className={`detail-value ${selectedUser.role === 'ADMIN' ? 'role-admin' : 'role-user'}`}>
//                     {selectedUser.role}
//                   </span>
//                 </div>
//                 {/* <div className="detail-row">
//                   <span className="detail-label">Created:</span>
//                   <span className="detail-value">{formatDate(selectedUser.createdAt)}</span>
//                 </div> */}
//               </div>
//             </div>
//           </div>

//           <div className="modal-footer">
//             <button
//               className="btn btn-secondary"
//               onClick={() => {
//                 setShowDeleteModal(false);
//                 setSelectedUser(null);
//                 setDeleteError('');
//               }}
//               disabled={deleting}
//             >
//               Cancel
//             </button>
//             <button
//               className="btn btn-danger"
//               onClick={handleDeleteAccount}
//               disabled={deleting}
//             >
//               {deleting ? "Deleting..." : "Delete Account"}
//             </button>
//           </div>
//         </div>
//       </div>
//     )}
//   </div>
// )}

// export default Accounts;

import { useEffect, useState } from 'react';
import api from '../services/api';
import './Accounts.css';
import { t } from '../locales';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleting, setDeleting] = useState(false);
const [deleteError, setDeleteError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [newAccountForm, setNewAccountForm] = useState({
    name: '',
    password: '',
    role: 'USER',
  });
  const [creating, setCreating] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [roleError, setRoleError] = useState('');
  const [createError, setCreateError] = useState('');

  // Get current user info
  const userRole = localStorage.getItem("user_role") || "Medical Staff";
  const userName = localStorage.getItem("user_name") || "";
  const isAdmin = userRole === "ADMIN" || userRole === "admin";

  useEffect(() => {
    if (isAdmin) {
      fetchAccounts();
    }
  }, [isAdmin]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/users');
      setAccounts(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError(t('accounts.error'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleAddAccount = async () => {
    // Validate form
    if (!newAccountForm.name.trim()) {
      setCreateError(t('accounts.usernameRequiredError'));
      return;
    }

    if (!newAccountForm.password.trim()) {
      setCreateError(t('accounts.passwordRequired'));
      return;
    }

    if (newAccountForm.password.length < 3) {
      setCreateError(t('accounts.passwordMinLength'));
      return;
    }

    try {
      setCreating(true);
      setCreateError('');

      const accountData = {
        name: newAccountForm.name.trim(),
        password: newAccountForm.password,
        role: newAccountForm.role,
      };

      const response = await api.post('/auth/register', accountData);

      // Add new account to list
      setAccounts(prev => [response.data, ...prev]);

      // Close modal and reset form
      setShowAddModal(false);
      resetNewAccountForm();

      alert(t('accounts.accountCreated'));
    } catch (err) {
      console.error('Error creating account:', err);
      setCreateError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        t('accounts.createError')
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAccount = async () => {
  if (!selectedUser) return;

  // Prevent deleting yourself
  if (selectedUser.name === userName) {
    setDeleteError(t('accounts.cannotDeleteOwnError'));
    return;
  }

  try {
    setDeleting(true);
    setDeleteError('');

    await api.delete(`/auth/users/${selectedUser.id}`);

    // Remove account from the list
    setAccounts(prev => prev.filter(account => account.id !== selectedUser.id));

    // Close modal
    setShowDeleteModal(false);
    setSelectedUser(null);
    
    alert(t('accounts.accountDeleted'));
  } catch (err) {
    console.error('Error deleting account:', err);
    setDeleteError(
      err.response?.data?.message || 
      t('accounts.deleteError')
    );
  } finally {
    setDeleting(false);
  }
};

  const handleUpdateRole = async (newRole) => {
    if (!selectedUser) return;

    try {
      setUpdatingRole(true);
      setRoleError('');

      const response = await api.patch(`/auth/users/${selectedUser.id}/role`, {
        role: newRole,
      });

      // Update the account in the local state
      setAccounts(prev =>
        prev.map(account =>
          account.id === selectedUser.id ? response.data : account
        )
      );

      setShowRoleModal(false);
      setSelectedUser(null);
      
      alert(t('accounts.roleUpdated', { role: newRole }));
    } catch (err) {
      console.error('Error updating role:', err);
      setRoleError(
        err.response?.data?.message || 
        t('accounts.updateError')
      );
    } finally {
      setUpdatingRole(false);
    }
  };

  const resetNewAccountForm = () => {
    setNewAccountForm({
      name: '',
      password: '',
      role: 'USER',
    });
    setCreateError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccountForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isAdmin) {
    return (
      <div className="accounts-page">
        <div className="page-header">
          <h1 className="page-title">{t('accounts.pageTitle')}</h1>
          <p className="page-subtitle">{t('accounts.pageSubtitle')}</p>
        </div>
        <div className="access-denied">
          <h3>{t('accounts.accessDenied')}</h3>
          <p>{t('accounts.accessDeniedMessage')}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="accounts-page">
        <div className="page-header">
          <h1 className="page-title">{t('accounts.pageTitle')}</h1>
          <p className="page-subtitle">{t('accounts.pageSubtitle')}</p>
        </div>
        <div className="loading-state">
          <p>{t('accounts.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="accounts-page">
        <div className="page-header">
          <h1 className="page-title">{t('accounts.pageTitle')}</h1>
          <p className="page-subtitle">{t('accounts.pageSubtitle')}</p>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchAccounts} className="btn btn-secondary">
            {t('accounts.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

 return (
  <div className="accounts-page">
    <div className="page-header">
      <div className="header-left">
        <h1 className="page-title">{t('accounts.pageTitle')}</h1>
        <p className="page-subtitle">{t('accounts.pageSubtitle')}</p>
      </div>
      <div className="header-actions">
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          {t('accounts.newAccount')}
        </button>
      </div>
    </div>

    <div className="accounts-grid">
      {accounts.map((account) => (
        <div key={account.id} className="account-card">
          <div className="account-header">
            <div className="account-title">
              <h3 className="account-name">{account.name}</h3>
              <span className={`account-role ${account.role === 'ADMIN' ? 'role-admin' : 'role-user'}`}>
                {account.role === 'ADMIN' ? t('accounts.administrator') : t('accounts.user')}
              </span>
            </div>
            <div className="status-badge status-active">
              {t('accounts.active')}
            </div>
          </div>

          <div className="account-details">
            <div className="detail-item">
              <span className="detail-label">{t('accounts.username')}:</span>
              <span className="detail-value">{account.name}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">{t('accounts.role')}:</span>
              <span className={`detail-value role ${account.role === 'ADMIN' ? 'role-admin' : 'role-user'}`}>
                {account.role === 'ADMIN' ? t('accounts.administrator') : t('accounts.user')}
              </span>
            </div>
          </div>

          <div className="account-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setSelectedUser(account);
                setShowDeleteModal(true);
                setDeleteError('');
              }}
              disabled={account.name === userName}
              title={account.name === userName ? t('accounts.cannotDeleteOwn') : t('accounts.deleteAccount')}
            >
              {t('accounts.delete')}
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSelectedUser(account);
                setShowRoleModal(true);
                setRoleError('');
              }}
            >
              {t('accounts.changeRole')}
            </button>
          </div>
        </div>
      ))}
    </div>

    {accounts.length === 0 && !loading && (
      <div className="empty-state">
        <p>{t('accounts.noAccounts')}</p>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          {t('accounts.createFirstAccount')}
        </button>
      </div>
    )}

    {/* Add Account Modal */}
    {showAddModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{t('accounts.createNewAccount')}</h2>
            <button
              className="modal-close"
              onClick={() => {
                setShowAddModal(false);
                resetNewAccountForm();
              }}
            >
              ×
            </button>
          </div>

          <div className="modal-body">
            {createError && (
              <div className="error-message">{createError}</div>
            )}

            <div className="new-account-form">
              <div className="form-group">
                <label htmlFor="name">
                  {t('accounts.usernameRequired')} <span className="required-indicator">{t('common.requiredIndicator')}</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newAccountForm.name}
                  onChange={handleInputChange}
                  placeholder={t('accounts.usernamePlaceholder')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  {t('accounts.password')} <span className="required-indicator">{t('common.requiredIndicator')}</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newAccountForm.password}
                  onChange={handleInputChange}
                  placeholder={t('accounts.passwordPlaceholder')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">{t('accounts.roleLabel')}</label>
                <select
                  id="role"
                  name="role"
                  value={newAccountForm.role}
                  onChange={handleInputChange}
                >
                  <option value="USER">{t('accounts.user')}</option>
                  <option value="ADMIN">{t('accounts.administrator')}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowAddModal(false);
                resetNewAccountForm();
              }}
              disabled={creating}
            >
              {t('accounts.cancel')}
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAddAccount}
              disabled={creating || !newAccountForm.name || !newAccountForm.password}
            >
              {creating ? t('accounts.creating') : t('accounts.createAccount')}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Change Role Modal */}
    {showRoleModal && selectedUser && (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{t('accounts.changeRoleFor')} {selectedUser.name}</h2>
            <button
              className="modal-close"
              onClick={() => {
                setShowRoleModal(false);
                setSelectedUser(null);
                setRoleError('');
              }}
            >
              ×
            </button>
          </div>

          <div className="modal-body">
            {roleError && (
              <div className="error-message">{roleError}</div>
            )}

            <div className="current-role-info">
              <p>{t('accounts.currentRole')} <strong>{selectedUser.role === 'ADMIN' ? t('accounts.administrator') : t('accounts.user')}</strong></p>
              <p>{t('accounts.selectNewRole')}</p>
            </div>

            <div className="role-options">
              <button
                className={`role-option ${selectedUser.role === 'USER' ? 'selected' : ''}`}
                onClick={() => handleUpdateRole('USER')}
                disabled={updatingRole}
              >
                <div className="role-title">{t('accounts.userTitle')}</div>
                <div className="role-description">
                  {t('accounts.userDescription')}
                </div>
              </button>

              <button
                className={`role-option ${selectedUser.role === 'ADMIN' ? 'selected' : ''}`}
                onClick={() => handleUpdateRole('ADMIN')}
                disabled={updatingRole}
              >
                <div className="role-title">{t('accounts.adminTitle')}</div>
                <div className="role-description">
                  {t('accounts.adminDescription')}
                </div>
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowRoleModal(false);
                setSelectedUser(null);
                setRoleError('');
              }}
              disabled={updatingRole}
            >
              {t('accounts.cancel')}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Delete Account Modal */}
    {showDeleteModal && selectedUser && (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{t('accounts.deleteAccountModal')}</h2>
            <button
              className="modal-close"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedUser(null);
                setDeleteError('');
              }}
            >
              ×
            </button>
          </div>

          <div className="modal-body">
            {deleteError && (
              <div className="error-message">{deleteError}</div>
            )}

            <div className="delete-confirmation">
              <div className="warning-icon">⚠️</div>
              <h3>{t('accounts.areYouSure')}</h3>
              <p dangerouslySetInnerHTML={{
                __html: t('accounts.deleteWarning', { name: selectedUser.name }).replace('<strong>', '<strong>').replace('</strong>', '</strong>')
              }}></p>
              
              <div className="user-details-preview">
                <div className="detail-row">
                  <span className="detail-label">{t('accounts.username')}:</span>
                  <span className="detail-value">{selectedUser.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">{t('accounts.role')}:</span>
                  <span className={`detail-value ${selectedUser.role === 'ADMIN' ? 'role-admin' : 'role-user'}`}>
                    {selectedUser.role === 'ADMIN' ? t('accounts.administrator') : t('accounts.user')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedUser(null);
                setDeleteError('');
              }}
              disabled={deleting}
            >
              {t('accounts.cancel')}
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? t('accounts.deleting') : t('accounts.deleteButton')}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

export default Accounts;