import React, { useEffect, useState } from 'react';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', department: '', face: '' });

  const fetchUsers = async () => {
    const res = await fetch('http://127.0.0.1:5000/users');
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingId(user._id);
    setFormData({ name: user.name, department: user.department, face: user.face });
  };

  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:5000/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  const handleUpdate = async (id) => {
    await fetch(`http://127.0.0.1:5000/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setEditingId(null);
    fetchUsers();
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="admin-panel">
      <h2>Admin Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Face (base64)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              {editingId === user._id ? (
                <>
                  <td><input name="name" value={formData.name} onChange={handleChange} /></td>
                  <td><input name="department" value={formData.department} onChange={handleChange} /></td>
                  <td><textarea name="face" value={formData.face} onChange={handleChange} rows={2} /></td>
                  <td>
                    <button onClick={() => handleUpdate(user._id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.name}</td>
                  <td>{user.department}</td>
                  <td><textarea readOnly value={user.face} rows={2} /></td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
