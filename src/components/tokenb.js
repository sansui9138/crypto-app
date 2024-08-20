import React, {  useState } from 'react';
import { ethers } from 'ethers';

const TokenBal = () => {
const [balances, setBalances] = useState([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tokenAddresses = [
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
        "0x4E15361FD6b4BB609Fa63C81A2be19d873717870"
  ];

  const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)"
  ];

  const fetchBalances = async () => {
    setLoading(true);
    setError(null);
    setBalances([]);

    try {
      if (!ethers.utils.isAddress(walletAddress)) {
        throw new Error('Invalid wallet address');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const balances = await Promise.all(
        tokenAddresses.map(async (tokenAddress) => {
          const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
          const balance = await tokenContract.balanceOf(walletAddress);
          const name = await tokenContract.name();
          const symbol = await tokenContract.symbol();
          const decimals = await tokenContract.decimals();
          const formattedBalance = ethers.utils.formatUnits(balance, decimals);

          return {
            tokenAddress,
            name,
            symbol,
            balance: formattedBalance,
          };
        })
      );

      setBalances(balances);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Ethereum-Based Token Balances</h3>
      <input
        type="text"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        placeholder="Enter Wallet Address"
      />
      <button onClick={fetchBalances}>Check Balances</button>

      {loading ? (
        <p>Loading balances...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <ul>
          {balances.map((token, index) => (
            <li key={index}>
              <strong>{token.name} ({token.symbol}):</strong> {token.balance}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TokenBal;