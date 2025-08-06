
import React, { useState, useEffect } from 'react';

const Login = () => {
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parse verification results from URL parameters
    const queryParams = new URLSearchParams(window.location.search);
    const resultParam = queryParams.get('result');
    
    if (resultParam) {
      try {
        const result = JSON.parse(resultParam);
        console.log('Verification result from URL:', result);
        setVerificationResult(result);
      } catch (error) {
        console.error('Error parsing verification result:', error);
        setVerificationResult({
          status: 'error',
          message: 'Error parsing verification result'
        });
      }
    } else {
      // No verification result, show default state
      setVerificationResult(null);
    }
    setLoading(false);
  }, []);

  const styles = {
    container: {
      margin: '2rem auto',
      padding: '2rem',
      maxWidth: '600px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      minHeight: '400px'
    },
    
    containerInner: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '2rem',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      textAlign: 'center'
    },
    
    title: {
      color: '#2d3748',
      marginBottom: '2rem',
      fontSize: '2rem',
      fontWeight: '600',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    
    successCard: {
      backgroundColor: '#d4edda',
      border: '1px solid #c3e6cb',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1rem'
    },
    
    errorCard: {
      backgroundColor: '#f8d7da',
      border: '1px solid #f5c6cb',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1rem'
    },
    
    successIcon: {
      fontSize: '3rem',
      color: '#28a745',
      marginBottom: '1rem'
    },
    
    errorIcon: {
      fontSize: '3rem',
      color: '#dc3545',
      marginBottom: '1rem'
    },
    
    statusText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    
    successText: {
      color: '#155724'
    },
    
    errorText: {
      color: '#721c24'
    },
    
    userInfo: {
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '1rem',
      margin: '1rem 0',
      textAlign: 'left'
    },
    
    infoLabel: {
      fontWeight: 'bold',
      color: '#495057',
      display: 'inline-block',
      width: '100px'
    },
    
    infoValue: {
      color: '#212529'
    },
    
    backButton: {
      backgroundColor: '#6c757d',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      marginTop: '1rem',
      textDecoration: 'none',
      display: 'inline-block'
    },
    
    loading: {
      fontSize: '18px',
      color: '#666'
    },
    
    defaultMessage: {
      fontSize: '16px',
      color: '#666',
      padding: '2rem'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.containerInner}>
          <h1 style={styles.title}>Face Verification</h1>
          <div style={styles.loading}>Loading verification results...</div>
        </div>
      </div>
    );
  }

  if (!verificationResult) {
    return (
      <div style={styles.container}>
        <div style={styles.containerInner}>
          <h1 style={styles.title}>Face Verification</h1>
          <div style={styles.defaultMessage}>
            <p>Please use the "Go to Login" button from the home page to start face verification.</p>
            <a href="/" style={styles.backButton}>Back to Home</a>
          </div>
        </div>
      </div>
    );
  }

  const isSuccess = verificationResult.status === 'granted';

  return (
    <div style={styles.container}>
      <div style={styles.containerInner}>
        <h1 style={styles.title}>Face Verification Result</h1>
        
        <div style={isSuccess ? styles.successCard : styles.errorCard}>
          <div style={isSuccess ? styles.successIcon : styles.errorIcon}>
            {isSuccess ? '✅' : '❌'}
          </div>
          
          <div style={{...styles.statusText, ...(isSuccess ? styles.successText : styles.errorText)}}>
            {verificationResult.message}
          </div>
          
          {isSuccess && verificationResult.name && (
            <div style={styles.userInfo}>
              <div>
                <span style={styles.infoLabel}>Name:</span>
                <span style={styles.infoValue}>{verificationResult.name}</span>
              </div>
              <div>
                <span style={styles.infoLabel}>Department:</span>
                <span style={styles.infoValue}>{verificationResult.department}</span>
              </div>
              {verificationResult.id && (
                <div>
                  <span style={styles.infoLabel}>ID:</span>
                  <span style={styles.infoValue}>{verificationResult.id}</span>
                </div>
              )}
            </div>
          )}
          
          {verificationResult.coordinates && (
            <div style={styles.userInfo}>
              <div>
                <span style={styles.infoLabel}>Face Size:</span>
                <span style={styles.infoValue}>
                  {verificationResult.coordinates.face_width} x {verificationResult.coordinates.face_height}
                </span>
              </div>
              {verificationResult.coordinates.eyes && verificationResult.coordinates.eyes.length >= 2 && (
                <>
                  <div>
                    <span style={styles.infoLabel}>Left Eye:</span>
                    <span style={styles.infoValue}>
                      ({verificationResult.coordinates.eyes[0].x}, {verificationResult.coordinates.eyes[0].y})
                    </span>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>Right Eye:</span>
                    <span style={styles.infoValue}>
                      ({verificationResult.coordinates.eyes[1].x}, {verificationResult.coordinates.eyes[1].y})
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        <a href="/" style={styles.backButton}>Back to Home</a>
      </div>
    </div>
  );
};

export default Login;