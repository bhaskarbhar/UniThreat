import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Registration successful!');
        navigate('/');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  return (
    <div style={styles.container}>
      {/* Left block with logo */}
      <div style={styles.leftBlock}>
        <div style={styles.logoWrapper}>
          <img
            src="/src/images/Unithreat_Logo.png"
            alt="Unithreat Logo"
            style={styles.image}
          />
        </div>
      </div>

      {/* Right block with register form */}
      <div style={styles.rightBlock}>
        <div style={styles.registerBox}>
          <h1 style={styles.title}>Register</h1>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Register</button>
            <p style={styles.text}>
              Already have an account? <Link to="/" style={styles.link}>Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: 'black',
  },
  leftBlock: {
    flex: 1,
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px',
  },
  logoWrapper: {
    maxWidth: '80%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
  },
  rightBlock: {
    flex: 1,
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px',
  },
  registerBox: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#1E1E1E',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 0 25px rgba(0, 255, 171, 0.3)',
  },
  title: {
    fontSize: '2rem',
    color: '#00FFAB',
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '15px',
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #00FFAB',
    borderRadius: '6px',
    backgroundColor: '#2C2C2C',
    color: '#fff',
    outline: 'none',
  },
  button: {
    padding: '12px',
    fontSize: '1rem',
    backgroundColor: '#00FFAB',
    color: '#121212',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  text: {
    marginTop: '15px',
    fontSize: '0.9rem',
    textAlign: 'center',
    color: '#aaa',
  },
  link: {
    color: '#00FFAB',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Register;
