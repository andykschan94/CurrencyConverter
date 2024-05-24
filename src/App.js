import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';

const BASE_URL = 'https://api.currencyapi.com/v3/latest?apikey=cur_live_8bXEX3K1NuL3proNq4KqlP7uoUqkB6CAjBZlgWZr';

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.data)[0];
        const options = [data.base, ...Object.keys(data.data)].filter(option => option);
        setCurrencyOptions(options);

        if (options.includes('SGD')) {
          setFromCurrency('SGD');
        } else {
          setFromCurrency(data.base);
        }

        if (options.includes('MYR')) {
          setToCurrency('MYR');
        } else {
          setToCurrency(firstCurrency);
        }

        setExchangeRate(data.data[firstCurrency]);
      });
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetch(`${BASE_URL}&base_currency=${fromCurrency}`)
        .then(res => res.json())
        .then(data => {
          setExchangeRate(data.data[toCurrency].value);
        });
    }
  }, [fromCurrency, toCurrency]);

  const handleFromAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  };

  const handleToAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  };

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = exchangeRate ? amount * exchangeRate : 0; // Updated
  } else {
    toAmount = amount;
    fromAmount = exchangeRate ? amount / exchangeRate : 0; // Updated
  }

  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        amount={isNaN(fromAmount) ? '' : fromAmount}
        onAmountChange={handleFromAmountChange}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        amount={isNaN(toAmount) ? '' : toAmount}
        onAmountChange={handleToAmountChange}
      />
    </>
  );
}

export default App;
