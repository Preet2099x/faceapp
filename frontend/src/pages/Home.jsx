import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Face Detection App</h1>

      <section style={{ marginTop: '2rem' }}>
        <h2>1. Register New User</h2>
        <p>Create a new user profile and face data.</p>
        <Link to="/signup">
          <button>Go to Signup</button>
        </Link>
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
