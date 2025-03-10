
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SampleQueries from './SampleQueries';

interface QueryFormProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

const QueryForm: React.FC<QueryFormProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
    }
  };

  const handleQuerySelect = (selectedQuery: string) => {
    setQuery(selectedQuery);
    onSubmit(selectedQuery);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="glass-dark p-6 rounded-xl animate-fade-in">
        <h2 className="text-lg font-medium mb-4">Supply Chain Query</h2>
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Ask a question about your supply chain..."
              className="pl-10 pr-16 py-6 h-auto text-base bg-background"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-20 top-3 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button 
            type="submit" 
            className="absolute right-2 top-2 shadow-none" 
            size="sm"
            disabled={isLoading || !query.trim()}
          >
            Analyze
          </Button>
        </form>
        
        <SampleQueries onSelectQuery={handleQuerySelect} />
      </div>
    </div>
  );
};

export default QueryForm;
