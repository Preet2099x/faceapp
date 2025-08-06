import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const handleSignupClick = async () => {
    try {
      console.log('Starting face registration...');
      const response = await fetch('http://127.0.0.1:5000/run_register_face');
      const result = await response.json();
      
      if (response.ok) {
        console.log('Registration script started successfully:', result.message);
        // Navigate to signup page after starting the script
        window.location.href = '/signup';
      } else {
        console.error('Failed to start registration script:', result.error);
        alert('Failed to start face registration: ' + result.error);
      }
    } catch (error) {
      console.error('Error calling registration endpoint:', error);
      alert('Error starting face registration. Make sure the backend server is running.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Face Detection App</h1>

      <section style={{ marginTop: '2rem' }}>
        <h2>1. Register New User</h2>
        <p>Create a new user profile and face data.</p>
        <button onClick={handleSignupClick}>Go to Signup</button>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>2. Verify New User</h2>
        <p>Login and verify face with saved data.</p>
        <Link to="/login">
          <button>Go to Login</button>
        </Link>
      </section>
    </div>
  )
}

export default Home
