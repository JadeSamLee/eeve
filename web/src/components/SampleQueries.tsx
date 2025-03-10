
import React from 'react';
import { SampleQuery } from '../utils/types';
import { sampleQueries } from '../utils/mockData';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SampleQueriesProps {
  onSelectQuery: (query: string) => void;
}

const SampleQueries: React.FC<SampleQueriesProps> = ({ onSelectQuery }) => {
  return (
    <div className="w-full mt-4 animate-fade-in">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Sample Queries</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sampleQueries.map((query, index) => (
          <button
            key={index}
            onClick={() => onSelectQuery(query.text)}
            className="group p-3 text-left rounded-lg border border-border bg-card hover:bg-secondary/50 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                  {query.text}
                </p>
                <p className="text-xs text-muted-foreground">{query.description}</p>
              </div>
              <Badge 
                variant="outline" 
                className="text-xs ml-2 opacity-70"
              >
                {query.category}
              </Badge>
            </div>
            <div className="flex items-center mt-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Run query</span>
              <ArrowUpRight className="w-3 h-3 ml-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SampleQueries;
