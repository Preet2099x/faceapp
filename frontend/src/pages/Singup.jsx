import React, { useState } from 'react';

// --- Style Objects for a Cleaner UI ---
const styles = {
  container: {
    margin: '2rem auto',
    padding: '2rem',
    maxWidth: '600px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    fontFamily: 'sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  fieldset: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  legend: {
    padding: '0 0.5rem',
    fontWeight: 'bold',
    color: '#333',
  },
  inputGroup: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },
  inputWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    color: '#555',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  message: {
    marginTop: '1.5rem',
    padding: '1rem',
    borderRadius: '4px',
    textAlign: 'center',
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  }
};

const Signup = () => {
  // State for all form fields
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [faceWidth, setFaceWidth] = useState('');
  const [faceHeight, setFaceHeight] = useState('');
  const [leftEyeX, setLeftEyeX] = useState('');
  const [leftEyeY, setLeftEyeY] = useState('');
  const [rightEyeX, setRightEyeX] = useState('');
  const [rightEyeY, setRightEyeY] = useState('');
  
  // State for user feedback
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    // --- Construct the nested payload for the backend ---
    const payload = {
      name,
      department,
      face: {
        face_width: Number(faceWidth),
        face_height: Number(faceHeight),
        eyes: [
          { x: Number(leftEyeX), y: Number(leftEyeY) },
          { x: Number(rightEyeX), y: Number(rightEyeY) }
        ]
      }
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage(`Success! User saved with ID: ${responseData.id}`);
        // Clear form fields after successful submission
        setName(''); setDepartment(''); setFaceWidth(''); setFaceHeight('');
        setLeftEyeX(''); setLeftEyeY(''); setRightEyeX(''); setRightEyeY('');
      } else {
        setIsError(true);
        setMessage(`Error: ${responseData.error}`);
      }
    } catch (error) {
      setIsError(true);
      setMessage('Network Error: Could not connect to the server.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register New Face Data</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>User Info</legend>
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <label style={styles.label} htmlFor="name">Name</label>
              <input style={styles.input} type="text" id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div style={styles.inputWrapper}>
              <label style={styles.label} htmlFor="department">Department</label>
              <input style={styles.input} type="text" id="department" value={department} onChange={e => setDepartment(e.target.value)} required />
            </div>
          </div>
        </fieldset>

        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Face Data</legend>
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <label style={styles.label} htmlFor="faceWidth">Face Width</label>
              <input style={styles.input} type="number" id="faceWidth" value={faceWidth} onChange={e => setFaceWidth(e.target.value)} required />
            </div>
            <div style={styles.inputWrapper}>
              <label style={styles.label} htmlFor="faceHeight">Face Height</label>
              <input style={styles.input} type="number" id="faceHeight" value={faceHeight} onChange={e => setFaceHeight(e.target.value)} required />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <label style={styles.label} htmlFor="leftEyeX">Left Eye (X)</label>
              <input style={styles.input} type="number" id="leftEyeX" value={leftEyeX} onChange={e => setLeftEyeX(e.target.value)} required />
            </div>
            <div style={styles.inputWrapper}>
              <label style={styles.label} htmlFor="leftEyeY">Left Eye (Y)</label>
              <input style={styles.input} type="number" id="leftEyeY" value={leftEyeY} onChange={e => setLeftEyeY(e.target.value)} required />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <label style={styles.label} htmlFor="rightEyeX">Right Eye (X)</label>
              <input style={styles.input} type="number" id="rightEyeX" value={rightEyeX} onChange={e => setRightEyeX(e.target.value)} required />
            </div>
            <div style={styles.inputWrapper}>
              <label style={styles.label} htmlFor="rightEyeY">Right Eye (Y)</label>
              <input style={styles.input} type="number" id="rightEyeY" value={rightEyeY} onChange={e => setRightEyeY(e.target.value)} required />
            </div>
          </div>
        </fieldset>

        <button type="submit" style={styles.button}>Save All Data</button>
      </form>
      
      {message && (
        <div style={{ ...styles.message, ...(isError ? styles.errorMessage : styles.successMessage) }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Signup;