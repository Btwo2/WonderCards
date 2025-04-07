import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Web3 from "web3";
import metamaskLogo from "../assets/images/metadraw.png";
import backgroundGif from "../assets/images/play.gif";
import styles from './Login.module.css';

const Login = ({ onLogin, onLogout}) => {
  
  const [error, setError] = useState('');
  const [err, setErr] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleWeb3LoginRedirect = async (e) => {
    setMessage("Connecting to MetaMask... Wait...");
    if (!window.ethereum) {
      setMessage("MetaMask not found");
      throw new Error("MetaMask not found");
    }

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    if (!accounts || !accounts.length) throw new Error("Not Found or Invalid Account");

    localStorage.setItem("wallet", accounts[0]);

    try {
      const response = await axios.post(
        'https://glowing-journey-p4wwpr5wj7pc65vx-5000.app.github.dev/api/users/login',
        {username: accounts[0], password: accounts[0]}, { headers: { 'Content-Type': 'application/json' }}
      );
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userID', response.data.userID);
      onLogin();
      navigate('/play');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        try {
            setMessage("Signing Up...");
            const response = await axios.post(
              'https://glowing-journey-p4wwpr5wj7pc65vx-5000.app.github.dev/api/users/register',
              {username: accounts[0], password: accounts[0]}, { headers: { 'Content-Type': 'application/json' }}
            );
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userID', response.data.userID);
            onLogin();
            navigate('/play');
          } catch (err) {
            setMessage('Error registering');
            
          }
      } else {
        setError('Error logging in');
      }
    }
    if (!window.ethereum) {
      setMessage("MetaMask not found");
      throw new Error("MetaMask not found");
    }

    setMessage("Connected to MetaMask - Redirecting...");

    alert(`✅ Successfully connected to MetaMask!\nWallet: ${accounts[0]}`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // 5-second delay

    navigate('/play');
  }

  return (
    <div
      className="background-container"
      style={{
        backgroundImage: `url(${backgroundGif})`,
      }}
    >
      <h1 className={`game-title ${"calm-title"}`}>
        WonderCards
      </h1>
      <div className={styles.container}>
        <button 
          type="button" 
          className={`${styles.metamaskButton} btn btn-dark px-3`} 
          onClick={handleWeb3LoginRedirect}
        >
          <img 
            src={metamaskLogo} 
            width="80" 
            className={`${styles.metamaskIcon} me-3`} 
            alt="MetaMask logo" 
          />
          <font className={styles.metamaskText}>Connect to MetaMask</font>
        </button>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};

export default Login;