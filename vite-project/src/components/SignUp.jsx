
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css'

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();

  const handleSignUp = async () => {
    try {

      const response = await axios.post('http://localhost:3000/users/signup', {
        username,
        password,
      });
      console.log(response.data);
      navigate('/login');
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div>
    <div className='auth-container'>
      <div className='auth-form '>
      <h2 style={{color:'blue',textAlign:'center'}}>Sign Up</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignUp}>Sign Up</button>
      </div>
      <h3 style={{color:'blue',textAlign:'center'}}>Already have account </h3>
      <button onClick={() => navigate('/login')} style={{
  width: '30%',
  padding: '10px',
  backgroundColor: 'rgb(226, 33, 233)',
  color: 'white',
  border: 'none',
  borderRadius: 5, 
  cursor: 'pointer'
}}>Login</button>
</div>
</div>);
}

export default SignUp;
