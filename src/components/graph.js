import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TokenGr = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const etherscanApiKey = 'SMH7FDYJMTMNC5IP3J36NJ4X5YP4VIR9JV';

  const tokenAddresses = [
    { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", name: "Tether", symbol: "USDT" }, 
    { address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52", name: "USD Coin", symbol: "USDC" }, 
    { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", name: "Dai", symbol: "DAI" }, 
  ]

  const getBlockNumberByTimestamp = async (timestamp) => {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${etherscanApiKey}`
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching block number:", error);
      return null;
    }
  };

  const fetchHistoricalBalances = async (blockNumber) => {
    try {
      const promises = tokenAddresses.map(async (token) => {
        const response = await axios.get(
          `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${token.address}&address=${walletAddress}&tag=${blockNumber}&apikey=${etherscanApiKey}`
        );

        const balance = response.data.result / Math.pow(10, 18); 
        return {
          symbol: token.symbol,
          balance: balance,
        };
      });

      const balances = await Promise.all(promises);
      return balances.reduce((acc, token) => {
        acc[token.symbol] = token.balance;
        return acc;
      }, {});
    } catch (error) {
      console.error("Error fetching historical balances:", error);
      return {};
    }
  };

  const fetchAndPlotHistoricalData = async () => {
    setLoading(true);
    setError(null);
    setHistoricalData([]);

    try {
      const timestamps = [
        Math.floor(new Date('2018-01-01').getTime() / 1000),
        Math.floor(new Date('2024-01-01').getTime() / 1000),
      ];

      const historicalBalances = await Promise.all(
        timestamps.map(async (timestamp) => {
          const blockNumber = await getBlockNumberByTimestamp(timestamp);
          const balancesAtBlock = await fetchHistoricalBalances(blockNumber);
          return {
            date: new Date(timestamp * 1000).toLocaleDateString(),
            ...balancesAtBlock,
          };
        })
      );

      setHistoricalData(historicalBalances);
    } catch (error) {
      setError('Error fetching historical data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Ethereum-Based Token Historical Balances</h3>
      <input
        type="text"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        placeholder="Enter Wallet Address"
      />
      <button onClick={fetchAndPlotHistoricalData}>Fetch and Plot Historical Data</button>

      {loading ? (
        <p>Loading historical data...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : historicalData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={historicalData}
            margin={{
              top: 20, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {tokenAddresses.map(token => (
              <Line key={token.symbol} type="monotone" dataKey={token.symbol} stroke="#8884d8" />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  );
};

export default TokenGr;
