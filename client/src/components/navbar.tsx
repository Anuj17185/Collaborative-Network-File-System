import React from 'react';

interface NavbarProps {
  isconnected: boolean;
  clientid: string;
}

export const Navbar: React.FC<NavbarProps> = ({ isconnected, clientid }) => (
  <header className="flex items-center justify-between border-b border-slate-800 pb-4">
    <div>
      <h1 className="text-xl font-bold text-white flex items-center gap-2">
        Collaborative File System
      </h1>
    </div>
    <div className="text-right">
      {/* <span
        className={`inline-block px-2.5 py-1 text-xs font-mono rounded-md ${
          isconnected
            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            : 'bg-rose-950 text-rose-400 border border-rose-800'
        }`}
      >
        {isconnected ? 'Connected' : 'Offline'}
      </span> */}
      <p className="text-xs text-slate-400 mt-1 font-mono">
        Client ID: {clientid || '...'}
      </p>
    </div>
  </header>
);