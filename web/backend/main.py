
import os
from typing import Dict, List, Optional, Union
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import json
from datetime import datetime
from graph_analysis import AmazonGraphAnalyzer

app = FastAPI(title="Supply Chain Resilience API")

# Configure CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the graph analyzer
graph_analyzer = AmazonGraphAnalyzer()

# Request and response models
class QueryRequest(BaseModel):
    query: str

class RiskScore(BaseModel):
    supplier: str
    score: float
    reasons: List[str]

class ClusterData(BaseModel):
    id: int
    name: str
    count: int
    color: str

class VisualData(BaseModel):
    clusters: Optional[List[ClusterData]] = None
    riskScores: Optional[List[RiskScore]] = None
    basicStats: Optional[Dict] = None

class QueryResponse(BaseModel):
    type: str  # "simple", "complex", or "hybrid"
    text: str
    visualData: Optional[VisualData] = None
    error: Optional[str] = None

# Sample graph data for fallback
sample_graph = {
    # ... keep existing code (sample_graph definition)
}

# Process different query types
def process_simple_query(query: str) -> QueryResponse:
    """Process a simple query using graph traversal"""
    query = query.lower()
    
    # Get basic stats from our graph analyzer
    stats = graph_analyzer.get_basic_stats()
    
    if "stats" in query or "overview" in query or "summary" in query:
        basic_stats = stats["basic_stats"]
        
        response_text = (
            f"The Amazon product co-purchasing network contains {basic_stats['num_nodes']} products "
            f"with {basic_stats['num_edges']} connections. The network density is {basic_stats['density']:.6f}. "
            f"The largest connected component contains {basic_stats['largest_cc_size']} nodes "
            f"({basic_stats['largest_cc_percentage']:.2f}% of the network). "
            f"Products have an average of {basic_stats['avg_in_degree']:.2f} incoming connections and "
            f"an average of {basic_stats['avg_out_degree']:.2f} outgoing connections."
        )
        
        return QueryResponse(
            type="simple",
            text=response_text,
            visualData=VisualData(basicStats=basic_stats)
        )
    
    elif "degree" in query or "distribution" in query:
        degree_dist = stats["degree_distribution"]
        response_text = (
            "The degree distribution shows how connected products are in the co-purchasing network. "
            "Most products have few connections, but some highly popular products have many connections. "
            "This follows a power-law distribution, which is common in real-world networks."
        )
        
        return QueryResponse(
            type="simple",
            text=response_text,
            visualData=VisualData(basicStats={"degree_distribution": degree_dist})
        )
    
    elif "hubs" in query or "important" in query or "central" in query:
        hubs = stats["hubs"]
        response_text = (
            "I've identified the most important products in the network based on their connections. "
            "These hub products have the most incoming links (most frequently co-purchased with other products) "
            "and outgoing links (recommend the most other products). "
            "The top products by PageRank are also shown, representing the most influential nodes in the network."
        )
        
        return QueryResponse(
            type="simple",
            text=response_text,
            visualData=VisualData(basicStats={"hubs": hubs})
        )
    
    else:
        # Fallback to the existing sample-based responses
        if "shoes" in query and "supplier" in query:
            return QueryResponse(
                type="simple",
                text="There are 3 suppliers that provide Shoes: Nike, Adidas, and SupplierX. Nike is the primary supplier with 60% of shoe production capacity."
            )
        elif "socks" in query and "supplier" in query:
            return QueryResponse(
                type="simple",
                text="Socks are supplied by Adidas (70% of production) and SupplierX (30% of production)."
            )
        elif "strike" in query:
            return QueryResponse(
                type="simple",
                text="The Strike_China_2025 event would directly impact 3 suppliers: Nike (primary impact: 80% production capacity affected), Adidas (secondary impact: 45% production capacity affected), and SupplierX (minimal impact: 15% production capacity affected). These suppliers collectively provide 70% of your total product inventory. Recommended action: Establish emergency procurement procedures with alternative suppliers in Southeast Asia."
            )
        else:
            return QueryResponse(
                type="simple",
                text=f"Based on your query '{query}', I found relevant supply chain information from our graph database. Please refer to the details in the results section."
            )

def process_complex_query(query: str) -> QueryResponse:
    """Process a complex query using Louvain community detection"""
    # Get community detection results
    communities = graph_analyzer.get_community_detection(algorithm="louvain", max_communities=5)
    
    # Get risk analysis
    risk_scores = graph_analyzer.get_risk_analysis(num_suppliers=5)
    
    response_text = (
        "Based on the Louvain community detection algorithm, I've identified several clusters "
        "in the Amazon co-purchasing network. These clusters represent groups of products that "
        "are frequently purchased together, suggesting they form natural categories or themes. "
        "The largest cluster contains products that appear to be central to the network. "
        "I've also performed a risk analysis on key nodes in the network, which could represent "
        "critical products in a supply chain context."
    )
    
    return QueryResponse(
        type="complex",
        text=response_text,
        visualData=VisualData(
            clusters=communities,
            riskScores=risk_scores
        )
    )

def process_hybrid_query(query: str) -> QueryResponse:
    """Process a hybrid query combining graph traversal and community detection"""
    query = query.lower()
    
    # Get basic stats
    stats = graph_analyzer.get_basic_stats()
    
    # Get community detection results
    communities = graph_analyzer.get_community_detection(algorithm="louvain", max_communities=3)
    
    # Get risk analysis
    risk_scores = graph_analyzer.get_risk_analysis(num_suppliers=3)
    
    response_text = (
        f"I've analyzed the Amazon co-purchasing network with {stats['basic_stats']['num_nodes']} products "
        f"and {stats['basic_stats']['num_edges']} connections. The community detection algorithm identified "
        f"{len(communities)} major clusters of products that are frequently purchased together. "
        f"The largest community contains {communities[0]['count']} products, which is "
        f"{communities[0]['percentage']:.2f}% of the network. "
        f"Based on centrality measures, I've also identified products that might represent "
        f"critical points in the supply chain, with risk scores based on their network position."
    )
    
    return QueryResponse(
        type="hybrid",
        text=response_text,
        visualData=VisualData(
            clusters=communities,
            riskScores=risk_scores,
            basicStats=stats["basic_stats"]
        )
    )

def determine_query_type(query: str) -> str:
    """Determine the type of query based on its content"""
    query = query.lower()
    
    # Complex queries involve risk assessment and clustering
    if "risk" in query or "cluster" in query or "community" in query:
        return "complex"
    
    # Hybrid queries combine simple retrieval with risk analysis
    if ("stats" in query or "overview" in query) and ("risk" in query or "cluster" in query):
        return "hybrid"
    
    # Default to simple queries
    return "simple"

@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """Process a natural language query about the supply chain graph"""
    try:
        # Ensure the graph is loaded
        if graph_analyzer.graph is None:
            # This will load the graph on first API call
            graph_analyzer.load_graph()
        
        query_type = determine_query_type(request.query)
        
        if query_type == "complex":
            return process_complex_query(request.query)
        elif query_type == "hybrid":
            return process_hybrid_query(request.query)
        else:
            return process_simple_query(request.query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/graph-stats")
async def get_graph_stats():
    """Get basic statistics about the graph"""
    try:
        if graph_analyzer.graph is None:
            graph_analyzer.load_graph()
        
        stats = graph_analyzer.get_basic_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/communities")
async def get_communities(algorithm: str = "louvain", max_communities: int = 10):
    """Get community detection results"""
    try:
        if graph_analyzer.graph is None:
            graph_analyzer.load_graph()
        
        communities = graph_analyzer.get_community_detection(
            algorithm=algorithm,
            max_communities=max_communities
        )
        return communities
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/risk-analysis")
async def get_risk_analysis(num_suppliers: int = 10):
    """Get risk analysis results"""
    try:
        if graph_analyzer.graph is None:
            graph_analyzer.load_graph()
        
        risks = graph_analyzer.get_risk_analysis(num_suppliers=num_suppliers)
        return risks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
