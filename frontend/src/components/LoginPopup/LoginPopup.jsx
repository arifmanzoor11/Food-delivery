import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from './../context/StoreContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currentState, setCurrentState] = useState('Login');
  const [data, setData] = useState({ name: "", email: "", password: "" });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

 const onLogin = async (event) => {
  event.preventDefault();
  const endpoint = currentState === 'Login' ? '/api/user/login' : '/api/user/register';

  try {
    const response = await axios.post(url + endpoint, data);
    const res = response.data;

    if (res.success) {
      setToken(res.token);
      localStorage.setItem("token", res.token);
      toast.success("Login successful! Redirecting...");

      setTimeout(() => {
        setShowLogin(false);
      }, 2500);
    } else {
      toast.error(res.message || "Authentication failed.");
    }

  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }
};


  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>

        <div className="login-popup-inputs">
          {currentState === 'Sign Up' && (
            <input
              name='name'
              value={data.name}
              onChange={onChangeHandler}
              type="text"
              placeholder='Your name'
              required
            />
          )}
          <input
            name='email'
            value={data.email}
            onChange={onChangeHandler}
            type="email"
            placeholder='Your email'
            required
          />
          <input
            name='password'
            value={data.password}
            onChange={onChangeHandler}
            type="password"
            placeholder='Password'
            required
          />
        </div>

        <button type='submit'>
          {currentState === 'Sign Up' ? 'Create account' : 'Login'}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>

        {currentState === 'Login' ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrentState('Sign Up')}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState('Login')}>Login here</span>
          </p>
        )}
      </form>

      {/* Toast Container */}
      <ToastContainer position="top-left" autoClose={3000} />
    </div>
  );
};

export default LoginPopup;
