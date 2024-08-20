import './index.css';
import Connectwallet from './components/wallet';
import TokenBalances from './components/balance';
import TokenBal from './components/tokenb';
import CheckAllowance from './components/allowance';
import TransferTokens from './components/transfer';
import Prices from './components/prices';
import TokenGr from './components/graph';
const App = () => {
  return (
    <div className="app">
      <Prices></Prices>
      <Connectwallet></Connectwallet>
      <TokenBalances></TokenBalances>
      <TokenBal></TokenBal>      
      <TokenGr></TokenGr>
      <CheckAllowance></CheckAllowance>
      <TransferTokens></TransferTokens>
    </div>
    
  );
  
};

export default App;