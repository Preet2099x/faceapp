import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    margin: '2rem auto',
    padding: '2rem',
    maxWidth: '700px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Changed to match button color
    borderRadius: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden',
    animation: 'slideInUp 0.8s ease-out'
  },
  
  containerInner: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  
  title: {
    textAlign: 'center',
    color: '#2d3748',
    marginBottom: '2rem',
    fontSize: '2rem',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'fadeInDown 1s ease-out'
  },
  
  status: {
    textAlign: 'center',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    border: '1px solid',
    animation: 'pulse 2s infinite'
  },
  
  statusConnecting: {
    backgroundColor: '#fef7e0',
    color: '#92400e',
    borderColor: '#f59e0b'
  },
  
  statusOpen: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderColor: '#10b981'
  },
  
  statusClosed: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderColor: '#ef4444'
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  
  fieldset: {
    border: '2px solid #e2e8f0',
    borderRadius: '16px',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  
  fieldsetHover: {
    borderColor: '#667eea',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
    transform: 'translateY(-2px)'
  },
  
  legend: {
    padding: '0 1rem',
    fontWeight: '600',
    color: '#4a5568',
    fontSize: '1.1rem',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  
  inputGroup: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem'
  },
  
  inputWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  
  label: {
    marginBottom: '0.5rem',
    color: '#4a5568',
    fontWeight: '500',
    fontSize: '0.9rem',
    transition: 'color 0.3s ease'
  },
  
  input: {
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    background: '#ffffff',
    transition: 'all 0.3s ease',
    outline: 'none'
  },
  
  inputFocus: {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    transform: 'scale(1.02)'
  },
  
  inputReadOnly: {
    background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
    borderColor: '#bae6fd',
    color: '#0369a1'
  },
  
  button: {
    padding: '16px 32px',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)'
  },
  
  message: {
    marginTop: '1.5rem',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: '500',
    animation: 'slideInUp 0.5s ease-out'
  },
  
  successMessage: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    border: '1px solid #10b981'
  },
  
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #ef4444'
  },
  
  floatingElement: {
    position: 'absolute',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
    animation: 'float 6s ease-in-out infinite'
  }
};

// Add CSS animations
const styleSheet = `
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(120deg);
  }
  66% {
    transform: translateY(10px) rotate(240deg);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`;

const Signup = () => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [faceWidth, setFaceWidth] = useState('');
  const [faceHeight, setFaceHeight] = useState('');
  const [leftEyeX, setLeftEyeX] = useState('');
  const [leftEyeY, setLeftEyeY] = useState('');
  const [rightEyeX, setRightEyeX] = useState('');
  const [rightEyeY, setRightEyeY] = useState('');
  
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [wsStatus, setWsStatus] = useState('Connecting...');
  
  // Hover states
  const [hoveredFieldset, setHoveredFieldset] = useState(null);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    // Inject CSS animations
    const style = document.createElement('style');
    style.textContent = styleSheet;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const coordinatesParam = queryParams.get('coordinates');
    
    if (coordinatesParam) {
      try {
        const coordinates = JSON.parse(coordinatesParam);
        console.log('Coordinates from URL:', coordinates);
        
        if (coordinates.face_width) setFaceWidth(coordinates.face_width);
        if (coordinates.face_height) setFaceHeight(coordinates.face_height);
        
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
  }, []);

    useEffect(() => {
  fetch('http://127.0.0.1:5000/run_register_face')
    .then(async res => {
      try {
        const data = await res.json();
        console.log('register_face.py output:', data);
        setMessage(data.message || 'register_face.py executed.');
        setIsError(false);
      } catch (jsonErr) {
        // response was not JSON — handle gracefully
        const text = await res.text();
        console.error('Non-JSON response:', text);
        setMessage('Unexpected response from server.');
        setIsError(true);
      }
    })
    .catch(err => {
      console.error('Error running register_face.py:', err);
      setMessage('Failed to run register_face.py');
      setIsError(true);
    });
}, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
  
  const getStatusStyle = () => {
    if (wsStatus.startsWith('Connected') || wsStatus.includes('received')) return styles.statusOpen;
    if (wsStatus.startsWith('Disconnected') || wsStatus.includes('Error')) return styles.statusClosed;
    return styles.statusConnecting;
  };

  const getInputStyle = (inputName, isReadOnly = false) => {
    let style = { ...styles.input };
    if (isReadOnly) style = { ...style, ...styles.inputReadOnly };
    if (focusedInput === inputName) style = { ...style, ...styles.inputFocus };
    return style;
  };

  const getFieldsetStyle = (fieldsetName) => {
    let style = { ...styles.fieldset };
    if (hoveredFieldset === fieldsetName) style = { ...style, ...styles.fieldsetHover };
    return style;
  };

  const getButtonStyle = () => {
    let style = { ...styles.button };
    if (buttonHovered) style = { ...style, ...styles.buttonHover };
    return style;
  };

  return (
    <div style={styles.container}>
      <div style={styles.floatingElement} />
      <div style={{ ...styles.floatingElement, top: '20%', right: '10%', animationDelay: '-2s' }} />
      <div style={{ ...styles.floatingElement, bottom: '15%', left: '15%', animationDelay: '-4s' }} />
      
      <div style={styles.containerInner}>
        <h2 style={styles.title}>Register New Face Data</h2>
        
        <div style={{...styles.status, ...getStatusStyle()}}>
          <strong>Status:</strong> {wsStatus}
        </div>

        <div onSubmit={handleSubmit} style={styles.form}>
          <fieldset 
            style={getFieldsetStyle('userInfo')}
            onMouseEnter={() => setHoveredFieldset('userInfo')}
            onMouseLeave={() => setHoveredFieldset(null)}
          >
            <legend style={styles.legend}>User Information</legend>
            <div style={styles.inputGroup}>
              <div style={styles.inputWrapper}>
                <label style={styles.label} htmlFor="name">Full Name</label>
                <input 
                  style={getInputStyle('name')}
                  type="text" 
                  id="name" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Enter your full name"
                  required 
                />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label} htmlFor="department">Department</label>
                <input 
                  style={getInputStyle('department')}
                  type="text" 
                  id="department" 
                  value={department} 
                  onChange={e => setDepartment(e.target.value)}
                  onFocus={() => setFocusedInput('department')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Enter your department"
                  required 
                />
              </div>
            </div>
          </fieldset>

          <fieldset 
            style={getFieldsetStyle('faceData')}
            onMouseEnter={() => setHoveredFieldset('faceData')}
            onMouseLeave={() => setHoveredFieldset(null)}
          >
            <legend style={styles.legend}>Biometric Face Data</legend>
            <div style={styles.inputGroup}>
              <div style={styles.inputWrapper}>
                <label style={styles.label} htmlFor="faceWidth">Face Width (px)</label>
                <input 
                  style={getInputStyle('faceWidth', true)}
                  type="number" 
                  id="faceWidth" 
                  value={faceWidth} 
                  onChange={e => setFaceWidth(e.target.value)} 
                  required 
                  readOnly
                />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label} htmlFor="faceHeight">Face Height (px)</label>
                <input 
                  style={getInputStyle('faceHeight', true)}
                  type="number" 
                  id="faceHeight" 
                  value={faceHeight} 
                  onChange={e => setFaceHeight(e.target.value)} 
                  required 
                  readOnly
                />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <div style={styles.inputWrapper}>
                <label style={styles.label} htmlFor="leftEyeX">Left Eye X-Coordinate</label>
                <input 
                  style={getInputStyle('leftEyeX', true)}
                  type="number" 
                  id="leftEyeX" 
                  value={leftEyeX} 
                  onChange={e => setLeftEyeX(e.target.value)} 
                  required 
                  readOnly
                />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label} htmlFor="leftEyeY">Left Eye Y-Coordinate</label>
                <input 
                  style={getInputStyle('leftEyeY', true)}
                  type="number" 
                  id="leftEyeY" 
                  value={leftEyeY} 
                  onChange={e => setLeftEyeY(e.target.value)} 
                  required 
                  readOnly
                />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <div style={styles.inputWrapper}>
                <label style={styles.label} htmlFor="rightEyeX">Right Eye X-Coordinate</label>
                <input 
                  style={getInputStyle('rightEyeX', true)}
                  type="number" 
                  id="rightEyeX" 
                  value={rightEyeX} 
                  onChange={e => setRightEyeX(e.target.value)} 
                  required 
                  readOnly
                />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label} htmlFor="rightEyeY">Right Eye Y-Coordinate</label>
                <input 
                  style={getInputStyle('rightEyeY', true)}
                  type="number" 
                  id="rightEyeY" 
                  value={rightEyeY} 
                  onChange={e => setRightEyeY(e.target.value)} 
                  required 
                  readOnly
                />
              </div>
            </div>
          </fieldset>
          
          <button 
            type="button" 
            style={getButtonStyle()}
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            onClick={handleSubmit}
          >
            💾 Save to Database
          </button>
        </div>
        
        {message && (
          <div style={{ ...styles.message, ...(isError ? styles.errorMessage : styles.successMessage) }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;