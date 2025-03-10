
import { QueryResponse } from './types';
import { mockResponses } from './mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Function to submit a query to the backend API
export const submitQuery = async (query: string): Promise<QueryResponse> => {
  try {
    // Check if we're in development mode with mock data enabled
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if we have a mock response for this exact query
      if (mockResponses[query]) {
        return mockResponses[query];
      }
      
      // For queries we don't have exact matches for, determine the type based on keywords
      if (query.toLowerCase().includes('risk') || query.toLowerCase().includes('cluster')) {
        return {
          type: "complex",
          text: `Analysis of "${query}" shows potential risks in your supply chain. I've identified 3 clusters of suppliers with varying risk levels. The suppliers in Cluster 1 (High Risk) should be monitored closely and alternative sources should be considered.`,
          visualData: {
            clusters: [
              { id: 1, name: "High Risk", count: 3, color: "#ef4444" },
              { id: 2, name: "Medium Risk", count: 5, color: "#f97316" },
              { id: 3, name: "Low Risk", count: 7, color: "#22c55e" }
            ],
            riskScores: [
              { 
                supplier: "Example Supplier 1", 
                score: 0.78, 
                reasons: ["Geographic concentration", "Limited alternatives"] 
              },
              { 
                supplier: "Example Supplier 2", 
                score: 0.52, 
                reasons: ["Some exposure to constrained regions", "Partial redundancy"] 
              },
              { 
                supplier: "Example Supplier 3", 
                score: 0.23, 
                reasons: ["Well diversified", "Multiple backup options"] 
              }
            ]
          }
        };
      }
      
      // Default to a simple query response
      return {
        type: "simple",
        text: `Based on your query "${query}", I found relevant supply chain information from our graph database. Please refer to the details in the results section.`
      };
    }

    // If we're using the actual backend, make the API call
    const response = await fetch(`${API_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to process query');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting query:', error);
    return {
      type: 'simple',
      text: 'Sorry, there was an error processing your query. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Health check function to ensure the backend is running
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      return true;
    }
    
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};
