
import { QueryResponse, SampleQuery } from './types';

export const sampleQueries: SampleQuery[] = [
  {
    text: "Which suppliers provide Shoes?",
    category: "simple",
    description: "Find suppliers for a specific product"
  },
  {
    text: "Which suppliers are at risk due to potential disruptions?",
    category: "complex",
    description: "Analyze supplier risk using Louvain community detection"
  },
  {
    text: "Who supplies Socks and what's their risk cluster?",
    category: "hybrid",
    description: "Combined query for supplier identification and risk assessment"
  },
  {
    text: "Show all suppliers impacted by Strike_China_2025",
    category: "simple",
    description: "Event impact analysis"
  }
];

export const mockResponses: Record<string, QueryResponse> = {
  "Which suppliers provide Shoes?": {
    type: "simple",
    text: "There are 3 suppliers that provide Shoes: Nike, Adidas, and SupplierX. Nike is the primary supplier with 60% of shoe production capacity."
  },
  "Which suppliers are at risk due to potential disruptions?": {
    type: "complex",
    text: "Based on the Louvain community detection algorithm, I've identified 3 risk clusters in your supply chain. Cluster 1 (High Risk) contains suppliers primarily located in China that may be affected by the Strike_China_2025 event. Recommended mitigation: Diversify suppliers across geographic regions and secure alternative suppliers for critical components.",
    visualData: {
      clusters: [
        { id: 1, name: "High Risk", count: 4, color: "#ef4444" },
        { id: 2, name: "Medium Risk", count: 6, color: "#f97316" },
        { id: 3, name: "Low Risk", count: 8, color: "#22c55e" }
      ],
      riskScores: [
        { 
          supplier: "Nike", 
          score: 0.85, 
          reasons: ["Located in China strike zone", "Single sourcing for key components"] 
        },
        { 
          supplier: "Adidas", 
          score: 0.65, 
          reasons: ["Partial exposure to China", "Some redundancy in supply chain"] 
        },
        { 
          supplier: "SupplierX", 
          score: 0.35, 
          reasons: ["Geographically diversified", "Multiple backup suppliers"] 
        }
      ]
    }
  },
  "Who supplies Socks and what's their risk cluster?": {
    type: "hybrid",
    text: "Socks are supplied by Adidas and SupplierX. Based on the Louvain community analysis, Adidas falls into the Medium Risk cluster (score: 0.65) due to partial exposure to the China region, while SupplierX is in the Low Risk cluster (score: 0.35) thanks to their geographic diversification. For resilience, consider increasing orders from SupplierX while developing backup suppliers for Adidas.",
    visualData: {
      clusters: [
        { id: 2, name: "Medium Risk", count: 6, color: "#f97316" },
        { id: 3, name: "Low Risk", count: 8, color: "#22c55e" }
      ],
      riskScores: [
        { 
          supplier: "Adidas", 
          score: 0.65, 
          reasons: ["Partial exposure to China", "Some redundancy in supply chain"] 
        },
        { 
          supplier: "SupplierX", 
          score: 0.35, 
          reasons: ["Geographically diversified", "Multiple backup suppliers"] 
        }
      ]
    }
  },
  "Show all suppliers impacted by Strike_China_2025": {
    type: "simple",
    text: "The Strike_China_2025 event would directly impact 3 suppliers: Nike (primary impact: 80% production capacity affected), Adidas (secondary impact: 45% production capacity affected), and SupplierX (minimal impact: 15% production capacity affected). These suppliers collectively provide 70% of your total product inventory. Recommended action: Establish emergency procurement procedures with alternative suppliers in Southeast Asia."
  }
};
