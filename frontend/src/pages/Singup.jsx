import React, { useState, useEffect } from 'react';

// (Your style objects can remain the same as before)
const styles = {
    // ... paste your existing styles object here ...
    container: { margin: '2rem auto', padding: '2rem', maxWidth: '600px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', fontFamily: 'sans-serif'},
    status: { textAlign: 'center', padding: '10px', borderRadius: '4px', marginBottom: '1rem' },
    statusConnecting: { backgroundColor: '#fffbe6', color: '#8a6d3b' },
    statusOpen: { backgroundColor: '#d4edda', color: '#155724' },
    statusClosed: { backgroundColor: '#f8d7da', color: '#721c24' },
    // ... rest of your styles ...
    form: { display: 'flex', flexDirection: 'column' },
    fieldset: { border: '1px solid #ddd', borderRadius: '4px', padding: '1rem', marginBottom: '1rem' },
    legend: { padding: '0 0.5rem', fontWeight: 'bold', color: '#333' },
    inputGroup: { display: 'flex', gap: '1rem', marginBottom: '1rem' },
    inputWrapper: { flex: 1, display: 'flex', flexDirection: 'column' },
    label: { marginBottom: '0.5rem', color: '#555' },
    input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' },
    button: { padding: '12px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' },
    message: { marginTop: '1.5rem', padding: '1rem', borderRadius: '4px', textAlign: 'center' },
    successMessage: { backgroundColor: '#d4edda', color: '#155724' },
    errorMessage: { backgroundColor: '#f8d7da', color: '#721c24' }
};


const Signup = () => {
  // State for form fields
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [faceWidth, setFaceWidth] = useState('');
  const [faceHeight, setFaceHeight] = useState('');
  const [leftEyeX, setLeftEyeX] = useState('');
  const [leftEyeY, setLeftEyeY] = useState('');
  const [rightEyeX, setRightEyeX] = useState('');
  const [rightEyeY, setRightEyeY] = useState('');
  
  // State for user feedback and connection status
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [wsStatus, setWsStatus] = useState('Connecting...');

  // --- URL Query Parameters Logic ---
  useEffect(() => {
    // Parse URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const coordinatesParam = queryParams.get('coordinates');
    
    if (coordinatesParam) {
      try {
        const coordinates = JSON.parse(coordinatesParam);
        console.log('Coordinates from URL:', coordinates);
        
        // Update the form fields with the data from the URL
        if (coordinates.face_width) setFaceWidth(coordinates.face_width);
        if (coordinates.face_height) setFaceHeight(coordinates.face_height);
        
        // Handle eye coordinates if they exist
        if (coordinates.eyes && coordinates.eyes.length >= 2) {
          setLeftEyeX(coordinates.eyes[0].x || '');
          setLeftEyeY(coordinates.eyes[0].y || '');
          setRightEyeX(coordinates.eyes[1].x || '');
          setRightEyeY(coordinates.eyes[1].y || '');
        }
        
        setMessage('Face data received from URL and fields populated!');
        setIsError(false);
        setWsStatus('Data received from face capture script.');
      } catch (error) {
        console.error('Error parsing coordinates from URL:', error);
        setWsStatus('Error parsing coordinates from URL.');
        setIsError(true);
      }
    } else {
      setWsStatus('No face data received. Please capture face data first.');
    }
  }, []); // The empty array ensures this effect runs only once

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... your existing handleSubmit logic to send data to the Flask API ...
    // This part does not need to change.
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
        const response = await fetch('http://127.0.0.1:5000/save', { // Your Flask API endpoint
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const responseData = await response.json();
        if (response.ok) {
            setMessage(`Success! User saved to database.`);
            setIsError(false);
        } else {
            setMessage(`API Error: ${responseData.error}`);
            setIsError(true);
        }
    } catch (error) {
        setMessage('Network Error: Could not connect to the API server.');
        setIsError(true);
    }
  };
  
  // A helper to determine the style for the status message
  const getStatusStyle = () => {
    if (wsStatus.startsWith('Connected')) return styles.statusOpen;
    if (wsStatus.startsWith('Disconnected')) return styles.statusClosed;
    return styles.statusConnecting;
  }

  return (
    <div style={styles.container}>
      <h2>Register New Face Data</h2>
      
      <div style={{...styles.status, ...getStatusStyle()}}>
        <strong>Status:</strong> {wsStatus}
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* The form fields are the same as before */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>User Info</legend>
          {/* ... name and department inputs ... */}
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
          <legend style={styles.legend}>Face Data (from camera)</legend>
           {/* ... face data inputs ... */}
           <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <label style={styles.label} htmlFor="faceWidth">Face Width</label>
              <input style={styles.input} type="number" id="faceWidth" value={faceWidth} onChange={e => setFaceWidth(e.target.value)} required readOnly/>
            </div>
            <div style={styles.inputWrapper}>
              <label style={styles.label} htmlFor="faceHeight">Face Height</label>
              <input style={styles.input} type="number" id="faceHeight" value={faceHeight} onChange={e => setFaceHeight(e.target.value)} required readOnly/>
            </div>
          </div>
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <label style={styles.label} htmlFor="leftEyeX">Left Eye (X)</label>
              <input style={styles.input} type="number" id="leftEyeX" value={leftEyeX} onChange={e => setLeftEyeX(e.target.value)} required readOnly/>
            </div>
            <div style={styles.inputWrapper}>
              <label style={styles.label} htmlFor="leftEyeY">Left Eye (Y)</label>
              <input style={styles.input} type="number" id="leftEyeY" value={leftEyeY} onChange={e => setLeftEyeY(e.target.value)} required readOnly/>
            </div>
          </div>
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <label style={styles.label} htmlFor="rightEyeX">Right Eye (X)</label>
              <input style={styles.input} type="number" id="rightEyeX" value={rightEyeX} onChange={e => setRightEyeX(e.target.value)} required readOnly/>
            </div>
            <div style={styles.inputWrapper}>
              <label style={styles.label} htmlFor="rightEyeY">Right Eye (Y)</label>
              <input style={styles.input} type="number" id="rightEyeY" value={rightEyeY} onChange={e => setRightEyeY(e.target.value)} required readOnly/>
            </div>
          </div>
        </fieldset>
        
        <button type="submit" style={styles.button}>Save to Database</button>
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