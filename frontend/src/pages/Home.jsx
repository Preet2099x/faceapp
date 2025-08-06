import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
          transform: translateY(0);
        }
        40%, 43% {
          transform: translateY(-15px);
        }
        70% {
          transform: translateY(-7px);
        }
      }

      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
        }
        70% {
          box-shadow: 0 0 0 20px rgba(102, 126, 234, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
        }
      }

      .fade-in-up {
        animation: fadeInUp 0.8s ease-out;
      }

      .bounce-hover:hover {
        animation: bounce 1s ease;
      }

      .card-hover {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .card-hover:hover {
        transform: translateY(-10px);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
      }

      .button-processing {
        animation: pulse 2s infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSignupClick = async () => {
    if (isRegistering) {
      alert('Face registration is already in progress. Please wait...');
      return;
    }

    try {
      setIsRegistering(true);
      console.log('Starting face registration...');
      const response = await fetch('http://127.0.0.1:5000/run_register_face');
      const result = await response.json();
      
      if (response.ok) {
        console.log('Registration script started successfully:', result.message);
        alert('Face registration started! Please look at the camera and wait for face capture to complete. You will be redirected to the signup page automatically.');
      } else if (response.status === 409) {
        alert('Face registration is already in progress. Please wait for it to complete.');
      } else {
        console.error('Failed to start registration script:', result.error);
        alert('Failed to start face registration: ' + result.error);
      }
    } catch (error) {
      console.error('Error calling registration endpoint:', error);
      alert('Error starting face registration. Make sure the backend server is running.');
    } finally {
      setTimeout(() => {
        setIsRegistering(false);
      }, 15000);
    }
  };

  const handleLoginClick = async () => {
    if (isVerifying) {
      alert('Face verification is already in progress. Please wait...');
      return;
    }

    try {
      setIsVerifying(true);
      console.log('Starting face verification...');
      const response = await fetch('http://127.0.0.1:5000/run_verify_face');
      const result = await response.json();
      
      if (response.ok) {
        console.log('Verification script started successfully:', result.message);
        alert('Face verification started! Please look at the camera and wait for face verification to complete. You will be redirected to the login page automatically.');
      } else if (response.status === 409) {
        alert('Face verification is already in progress. Please wait for it to complete.');
      } else {
        console.error('Failed to start verification script:', result.error);
        alert('Failed to start face verification: ' + result.error);
      }
    } catch (error) {
      console.error('Error calling verification endpoint:', error);
      alert('Error starting face verification. Make sure the backend server is running.');
    } finally {
      setTimeout(() => {
        setIsVerifying(false);
      }, 15000);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    
    mainCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '25px',
      padding: '3rem',
      maxWidth: '900px',
      width: '100%',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)',
    },

    header: {
      textAlign: 'center',
      marginBottom: '3rem',
    },

    title: {
      fontSize: '3.5rem',
      fontWeight: '700',
      marginBottom: '1rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },

    subtitle: {
      fontSize: '1.25rem',
      color: '#64748b',
      fontWeight: '400',
      lineHeight: '1.6',
    },

    cardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem',
    },

    card: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRadius: '20px',
      padding: '2.5rem',
      border: '2px solid #e2e8f0',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    },

    cardIcon: {
      fontSize: '3rem',
      marginBottom: '1.5rem',
      display: 'block',
    },

    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '1rem',
    },

    cardDescription: {
      color: '#64748b',
      fontSize: '1rem',
      lineHeight: '1.6',
      marginBottom: '1.5rem',
    },

    button: {
      width: '100%',
      padding: '1rem 2rem',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      position: 'relative',
      overflow: 'hidden',
    },

    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    },

    secondaryButton: {
      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)',
    },

    adminButton: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
    },

    buttonDisabled: {
      background: '#94a3b8',
      cursor: 'not-allowed',
      opacity: 0.6,
      boxShadow: 'none',
    },

    adminCard: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
      border: '2px solid #a7f3d0',
    },

    footer: {
      textAlign: 'center',
      marginTop: '2rem',
      color: '#64748b',
      fontSize: '0.9rem',
    },

    statusText: {
      fontSize: '0.9rem',
      fontWeight: '500',
      textTransform: 'none',
      letterSpacing: 'normal',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainCard} className="fade-in-up">
        <div style={styles.header}>
          <h1 style={styles.title} className="bounce-hover">
            Face Detection App
          </h1>
          <p style={styles.subtitle}>
            Secure authentication using advanced facial recognition technology
          </p>
        </div>

        <div style={styles.cardsContainer}>
          <div style={{...styles.card, ...{borderColor: '#a855f7'}}} className="card-hover">
            <span style={{...styles.cardIcon, color: '#a855f7'}}>👤</span>
            <h2 style={styles.cardTitle}>Register New User</h2>
            <p style={styles.cardDescription}>
              Create a new user profile with facial recognition data for secure access
            </p>
            <button 
              style={{
                ...styles.button,
                ...styles.primaryButton,
                ...(isRegistering ? styles.buttonDisabled : {})
              }}
              className={isRegistering ? 'button-processing' : ''}
              onClick={handleSignupClick}
              disabled={isRegistering}
            >
              {isRegistering ? (
                <span style={styles.statusText}>🔄 Registration in Progress...</span>
              ) : (
                'Start Registration'
              )}
            </button>
          </div>

          <div style={{...styles.card, ...{borderColor: '#06b6d4'}}} className="card-hover">
            <span style={{...styles.cardIcon, color: '#06b6d4'}}>🔍</span>
            <h2 style={styles.cardTitle}>Verify User</h2>
            <p style={styles.cardDescription}>
              Login and verify your identity using facial recognition technology
            </p>
            <button 
              style={{
                ...styles.button,
                ...styles.secondaryButton,
                ...(isVerifying ? styles.buttonDisabled : {})
              }}
              className={isVerifying ? 'button-processing' : ''}
              onClick={handleLoginClick}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <span style={styles.statusText}>🔄 Verification in Progress...</span>
              ) : (
                'Start Verification'
              )}
            </button>
          </div>

          <div style={{...styles.card, ...styles.adminCard}} className="card-hover">
            <span style={{...styles.cardIcon, color: '#10b981'}}>⚙️</span>
            <h2 style={styles.cardTitle}>Admin Panel</h2>
            <p style={styles.cardDescription}>
              Manage all registered users, edit profiles, and monitor system activity
            </p>
            <Link to="/admin" style={{ textDecoration: 'none' }}>
              <button style={{...styles.button, ...styles.adminButton}}>
                Open Admin Panel
              </button>
            </Link>
          </div>
        </div>

        <div style={styles.footer}>
          <p>Powered by OpenCV and React • Secure • Fast • Reliable</p>
        </div>
      </div>
    </div>
  );
};

export default Home
