import React, { useState } from 'react';
import { ethers } from 'ethers';

const TransferTokens = () => {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [transactionHash, setTransactionHash] = useState(null);
  const [error, setError] = useState(null);

  const transferTokens = async () => {
    if (!ethers.utils.isAddress(recipientAddress) || !ethers.utils.isAddress(tokenAddress)) {
      setError('Invalid address provided');
      return;
    }

    try {
      setError(null);
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      
      const erc20ABI = [
        
        "function transfer(address to, uint256 amount) returns (bool)"
      ];
      
      const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);

      
      const formattedAmount = ethers.utils.parseUnits(amount, 18);

      
      const tx = await tokenContract.transfer(recipientAddress, formattedAmount);
      
      
      const receipt = await tx.wait();

      setTransactionHash(receipt.transactionHash);
    } catch (err) {
      setError('Error executing token transfer. Ensure the wallet is connected and has sufficient funds.');
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Transfer ERC-20 Tokens</h3>
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
        <label>Recipient Address:</label>
        <input
          type="text"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          placeholder="Enter Recipient Wallet Address"
        />
      </div>
      <div>
        <label>Amount:</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount to Transfer"
        />
      </div>
      <button onClick={transferTokens}>Transfer Tokens</button>

      {transactionHash && (
        <p>Transaction successful! Hash: {transactionHash}</p>
      )}

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}
    </div>
  );
};

export default TransferTokens;
