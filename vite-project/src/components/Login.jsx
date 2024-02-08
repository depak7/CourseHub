import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css'

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/users/login', {
        username,
        password,
      });
      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
        console.log(token);
        navigate('/courses');
      } else {
        console.error('Token not found in login response');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div  className='auth-container'>
      <div className='auth-form' >
      <h2 style={{ color: 'blue' ,textAlign:'center'}}>Login</h2>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
