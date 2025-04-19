import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Login successful!');
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftBlock}>
        <div style={styles.logoWrapper}>
          <img src="/src/images/Unithreat_Logo.png" alt="Unithreat Logo" style={styles.image} />
        </div>
        <h1>Your One stop solution for all threat Intel tools</h1>
      </div>
      <div style={styles.rightBlock}>
        <div style={styles.loginCard}>
          <h1 style={styles.title}>Login</h1>
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
            <button type="submit" style={styles.button}>Login</button>
            <p style={styles.text}>
              Don't have an account? <Link to="/register" style={styles.link}>Register</Link>
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  rightBlock: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loginCard: {
    backgroundColor: '#1E1E1E',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 5px 100px rgba(0, 255, 171, 0.25)',
    width: '100%',
    maxWidth: '400px',
  },
  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '70%',
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
  },
  title: {
    marginBottom: '20px',
    fontSize: '2rem',
    color: '#00FFAB',
    textAlign: 'center',
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
    transition: 'background-color 0.3s',
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

export default Login;
