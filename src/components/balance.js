import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const TokenBalances = () => {
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    const fetchBalances = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();

      const tokenAddresses = [
        
        "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32" 
        
      
      ];

      const erc20Abi = [
        "function balanceOf(address owner) view returns (uint256)"
      ];

      const getTokenBalances = async (walletAddress, tokenAddresses) => {
        const balances = await Promise.all(
          tokenAddresses.map(async (tokenAddress) => {
            const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
            const balance = await tokenContract.balanceOf(walletAddress);
            return {
              tokenAddress,
              balance: ethers.utils.formatUnits(balance, 18)
            };
          })
        );
        return balances;
      };

      const balances = await getTokenBalances(walletAddress, tokenAddresses);
      setBalances(balances);
    };

    fetchBalances();
  }, []);

  return (
    <div>
      <h3>Token Balances</h3>
      <ul>
        {balances.map((balance, index) => (
          <li key={index}>
            Token Address: {balance.tokenAddress} - Balance: {balance.balance}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TokenBalances;
