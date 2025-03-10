
import React from 'react';
import { Network } from 'lucide-react';

const Header = () => {
  return (
    <header className="container py-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Network className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">EEVE</h1>
            <p className="text-sm text-muted-foreground">GraphRAG-powered supply chain analytics</p>
          </div>
        </div>
        <div className="hidden md:flex items-center">
          <div className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full">
            ArangoDB
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
