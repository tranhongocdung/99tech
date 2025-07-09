import React, { useState, useEffect } from 'react';
import type { TokenOption } from './TokenSelectDropdown';
import TokenSelectDropdown from './TokenSelectDropdown';
import toast, { Toaster } from 'react-hot-toast';

interface Token extends TokenOption {
  price: number;
}

const TOKEN_ICON_URL = (symbol: string) => `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg`;

const TokenExchange: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch tokens from API
  useEffect(() => {
    fetch('https://interview.switcheo.com/prices.json')
      .then(res => res.json())
      .then((data: { currency: string; price: number }[]) => {
        // Use the latest price for each unique currency
        const unique: Record<string, Token> = {};
        data.forEach(item => {
          unique[item.currency] = {
            id: item.currency,
            name: item.currency,
            symbol: item.currency,
            icon: TOKEN_ICON_URL(item.currency),
            price: item.price,
          };
        });
        const tokenList = Object.values(unique);
        setTokens(tokenList);
        setFromToken(tokenList[0] || null);
        setToToken(tokenList[1] || null);
      });
  }, []);

  // Calculate exchange rate and converted amount
  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      const rate = toToken.price / fromToken.price;
      setExchangeRate(rate);
      const converted = parseFloat(fromAmount) * rate;
      setToAmount(converted.toFixed(6));
    } else {
      setToAmount('');
      setExchangeRate(0);
    }
  }, [fromToken, toToken, fromAmount]);

  const handleSwapTokens = () => {
    if (fromToken && toToken) {
      setFromToken(toToken);
      setToToken(fromToken);
      setFromAmount(toAmount);
    }
  };

  const handleExchange = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0 || !fromToken || !toToken) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success(`Successfully exchanged ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`);
    setFromAmount('');
    setToAmount('');
    setIsLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Token Exchange</h1>
          <p className="text-gray-600">Swap tokens instantly with real-time rates</p>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Exchange Tokens</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  You Pay
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="min-w-[160px]">
                    {fromToken && (
                      <TokenSelectDropdown
                        options={tokens}
                        value={fromToken}
                        onChange={token => setFromToken(token as Token)}
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                  <span>Balance: 100.00 {fromToken?.symbol}</span>
                  <span>{fromToken ? formatPrice(fromToken.price) : '-'}</span>
                </div>
              </div>
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleSwapTokens}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  disabled={!fromToken || !toToken}
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  You Receive
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={toAmount}
                    onChange={(e) => setToAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="min-w-[160px]">
                    {toToken && (
                      <TokenSelectDropdown
                        options={tokens}
                        value={toToken}
                        onChange={token => setToToken(token as Token)}
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                  <span>Balance: 50.00 {toToken?.symbol}</span>
                  <span>{toToken ? formatPrice(toToken.price) : '-'}</span>
                </div>
              </div>
              {exchangeRate > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Exchange Rate:</span>
                    <span className="font-medium">
                      1 {fromToken?.symbol} = {exchangeRate.toFixed(6)} {toToken?.symbol}
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={handleExchange}
                disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isLoading || !fromToken || !toToken}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Exchange Now'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenExchange; 