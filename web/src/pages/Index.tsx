
import React, { useState } from 'react';
import QueryForm from '../components/QueryForm';
import ResultDisplay from '../components/ResultDisplay';
import Header from '../components/Header';
import { QueryResponse } from '../utils/types';
import { submitQuery } from '../utils/api';
import { toast } from '@/hooks/use-toast';
import { Globe, Network, Server } from 'lucide-react';

const Index = () => {
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    setIsLoading(true);
    try {
      const result = await submitQuery(query);
      setResponse(result);
      
      // Show a toast based on the query type
      if (result.type === 'complex') {
        toast({
          title: "Community detection complete",
          description: "Product communities have been identified using Louvain algorithm.",
          duration: 3000,
        });
      } else if (result.type === 'hybrid') {
        toast({
          title: "Combined analysis complete",
          description: "Graph metrics and community detection were used for this query.",
          duration: 3000,
        });
      } else {
        toast({
          title: "Network analysis complete",
          description: "Graph metrics were computed for the Amazon product network.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error processing query:', error);
      toast({
        title: "Error processing query",
        description: "There was a problem analyzing your graph query.",
        variant: "destructive",
      });
      setResponse({
        type: 'simple',
        text: 'Sorry, there was an error processing your query. Please try again.',
        error: 'Query processing failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container pb-20">
        <div className="text-center max-w-3xl mx-auto mb-12 mt-8">
          <div className="flex justify-center mb-6 relative">
            <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center animate-float">
              <Network className="w-10 h-10 text-primary" />
            </div>
            <div className="absolute -left-4 top-14 w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center animate-float" style={{ animationDelay: '500ms' }}>
              <Server className="w-6 h-6 text-primary/80" />
            </div>
            <div className="absolute -right-4 top-14 w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center animate-float" style={{ animationDelay: '1000ms' }}>
              <Globe className="w-6 h-6 text-primary/80" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Amazon Co-purchasing Network Analysis
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Analyze the SNAP Amazon0302 co-purchasing network using graph analytics and community detection
          </p>
        </div>
        
        <QueryForm onSubmit={handleSubmit} isLoading={isLoading} />
        <ResultDisplay response={response} isLoading={isLoading} />
      </main>
      
      <footer className="py-6 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              Amazon Co-purchasing Network Analysis - SNAP Dataset
            </div>
            <div className="flex space-x-6">
              <div className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                NetworkX
              </div>
              <div className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                SNAP Dataset
              </div>
              <div className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                NVIDIA
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
