import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', department: '' });

  // Fetch all users from the database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:5000/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Error fetching users: ' + err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/user/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Refresh the user list
      await fetchUsers();
      alert('User deleted successfully!');
    } catch (err) {
      alert('Error deleting user: ' + err.message);
      console.error('Error deleting user:', err);
    }
  };

  // Start editing a user
  const startEditing = (user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name,
      department: user.department
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingUser(null);
    setEditForm({ name: '', department: '' });
  };

  // Save edited user
  const saveUser = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Refresh the user list
      await fetchUsers();
      setEditingUser(null);
      setEditForm({ name: '', department: '' });
      alert('User updated successfully!');
    } catch (err) {
      alert('Error updating user: ' + err.message);
      console.error('Error updating user:', err);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      color: '#2d3748',
      marginBottom: '2rem',
      fontSize: '2rem',
      fontWeight: 'bold'
    },
    refreshButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      marginBottom: '1rem'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    th: {
      backgroundColor: '#f8f9fa',
      padding: '12px',
      textAlign: 'left',
      borderBottom: '2px solid #dee2e6',
      fontWeight: 'bold'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #dee2e6'
    },
    editButton: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '5px 10px',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      marginRight: '5px',
      fontSize: '14px'
    },
    deleteButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      padding: '5px 10px',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    saveButton: {
      backgroundColor: '#28a745',
      color: 'white',
      padding: '5px 10px',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      marginRight: '5px',
      fontSize: '14px'
    },
    cancelButton: {
      backgroundColor: '#6c757d',
      color: 'white',
      padding: '5px 10px',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    input: {
      padding: '5px',
      border: '1px solid #ccc',
      borderRadius: '3px',
      width: '100%',
      fontSize: '14px'
    },
    loading: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#666'
    },
    error: {
      color: '#dc3545',
      textAlign: 'center',
      fontSize: '16px',
      marginBottom: '1rem'
    },
    noUsers: {
      textAlign: 'center',
      fontSize: '16px',
      color: '#666',
      padding: '2rem'
    },
    faceData: {
      fontSize: '12px',
      color: '#666',
      maxWidth: '200px',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Admin Panel</h1>
        <div style={styles.loading}>Loading users...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Admin Panel - User Management</h1>
      
      <button 
        style={styles.refreshButton}
        onClick={fetchUsers}
      >
        Refresh Data
      </button>

      {error && (
        <div style={styles.error}>{error}</div>
      )}

      {users.length === 0 ? (
        <div style={styles.noUsers}>
          No users found in the database.
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Face Data</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={styles.td}>{user._id}</td>
                
                <td style={styles.td}>
                  {editingUser === user._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                
                <td style={styles.td}>
                  {editingUser === user._id ? (
                    <input
                      type="text"
                      name="department"
                      value={editForm.department}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                  ) : (
                    user.department
                  )}
                </td>
                
                <td style={styles.td}>
                  <div style={styles.faceData}>
                    {user.face ? (
                      `Face detected: ${user.face.face_width}x${user.face.face_height}, ${user.face.eyes?.length || 0} eyes`
                    ) : (
                      'No face data'
                    )}
                  </div>
                </td>
                
                <td style={styles.td}>
                  {editingUser === user._id ? (
                    <div>
                      <button
                        style={styles.saveButton}
                        onClick={() => saveUser(user._id)}
                      >
                        Save
                      </button>
                      <button
                        style={styles.cancelButton}
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        style={styles.editButton}
                        onClick={() => startEditing(user)}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.deleteButton}
                        onClick={() => deleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;
