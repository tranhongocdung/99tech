import React, { useState, useRef, useEffect } from 'react';

export interface TokenOption {
  id: string;
  name: string;
  symbol: string;
  icon: string;
}

interface TokenSelectDropdownProps {
  options: TokenOption[];
  value: TokenOption;
  onChange: (token: TokenOption) => void;
  label?: string;
}

const TokenSelectDropdown: React.FC<TokenSelectDropdownProps> = ({ options, value, onChange, label }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(
    (token) =>
      token.name.toLowerCase().includes(search.toLowerCase()) ||
      token.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      {label && <label className="block text-xs text-gray-500 mb-1">{label}</label>}
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        onClick={() => setOpen((o) => !o)}
      >
        <img src={value.icon} alt={value.symbol} className="w-5 h-5 rounded-full" />
        <span className="font-medium text-gray-900">{value.symbol}</span>
        <svg className={`w-4 h-4 ml-auto transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg" style={{overflowX: 'hidden'}}>
          <div className="p-2 sticky top-0 bg-white z-10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search token..."
              className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              autoFocus
            />
          </div>
          <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100 custom-scrollbar" style={{overflowX: 'hidden'}}>
            {filteredOptions.length === 0 && (
              <li className="p-3 text-center text-gray-400 text-sm">No tokens found</li>
            )}
            {filteredOptions.map((token) => (
              <li
                key={token.id}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${value.id === token.id ? 'bg-blue-100 font-semibold' : ''}`}
                onClick={() => {
                  onChange(token);
                  setOpen(false);
                  setSearch('');
                }}
              >
                <img src={token.icon} alt={token.symbol} className="w-5 h-5 rounded-full" />
                <span>{token.symbol}</span>
                {/* <span className="ml-auto text-xs text-gray-500">{token.name}</span> */}
                {value.id === token.id && (
                  <svg className="w-4 h-4 text-blue-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TokenSelectDropdown; 