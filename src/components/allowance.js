import React, { useState } from 'react';
import { ethers } from 'ethers';

const CheckAllowance = () => {
  const [ownerAddress, setOwnerAddress] = useState('');
  const [spenderAddress, setSpenderAddress] = useState('');
  const [allowance, setAllowance] = useState(null);
  const [tokenAddress, setTokenAddress] = useState('');
  const [error, setError] = useState(null);

  const checkAllowance = async () => {
    if (!ethers.utils.isAddress(ownerAddress) || !ethers.utils.isAddress(spenderAddress) || !ethers.utils.isAddress(tokenAddress)) {
      setError('Invalid address provided');
      return;
    }

    try {
      setError(null);
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      
      const erc20ABI = [
        
        "function allowance(address owner, address spender) view returns (uint256)"
      ];

      
      const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, provider);

      
      const result = await tokenContract.allowance(ownerAddress, spenderAddress);
      setAllowance(ethers.utils.formatUnits(result, 18)); 
    } catch (err) {
      setError('Error fetching allowance. Ensure the wallet is connected.');
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Check ERC-20 Token Allowance</h3>
      <div>
        <label>Token Contract Address:</label>
        <input
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="Enter Token Contract Address"
        />
      </div>
      <div>
        <label>Owner Address:</label>
        <input
          type="text"
          value={ownerAddress}
          onChange={(e) => setOwnerAddress(e.target.value)}
          placeholder="Enter Owner Wallet Address"
        />
      </div>
      <div>
        <label>Spender Address:</label>
        <input
          type="text"
          value={spenderAddress}
          onChange={(e) => setSpenderAddress(e.target.value)}
          placeholder="Enter Spender Wallet Address"
        />
      </div>
      <button onClick={checkAllowance}>Check Allowance</button>

      {allowance !== null && (
        <p>Allowance: {allowance} tokens</p>
      )}

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}
    </div>
  );
};

export default CheckAllowance;
