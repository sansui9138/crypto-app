import React, { useState, useEffect } from 'react';
import {Web3} from 'web3'
const Connectwallet = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [walletConnected, setWalletConnected] = useState(false);
    const [metamaskInstalled, setMetamaskInstalled] = useState(false);
  
    useEffect(() => {

      if (typeof window.ethereum !== 'undefined') {
        setMetamaskInstalled(true);
      }
  

      const web = new Web3(window.ethereum);
  

      web.eth.getAccounts().then(accounts => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
        }
      });
    }, []);
  
    const handleConnectWallet = async () => {

      const web = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web.eth.getAccounts();
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleInputWalletAddress = async (event) => {
      const inputAddress = event.target.value;
      setWalletAddress(inputAddress);
    };
  
    return (
      <div>
        {metamaskInstalled ? (
          <button onClick={handleConnectWallet}>Connect to Metamask</button>
        ) : (
          <p>Metamask is not installed. Please install Metamask to connect to your wallet.</p>
        )}
        <input
          type="text"
          value={walletAddress}
          onChange={handleInputWalletAddress}
          placeholder="Enter wallet address"
        />
        {walletConnected ? (
          <p>Connected to wallet: {walletAddress}</p>
        ) : (
          <p>Not connected to a wallet.</p>
        )}
      </div>
    );
  };
  
  export default Connectwallet;