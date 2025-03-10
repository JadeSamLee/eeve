
import os
import wget
import gzip
import networkx as nx
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from collections import Counter

class AmazonGraphAnalyzer:
    def __init__(self, data_dir="./data"):
        self.data_dir = data_dir
        self.dataset_url = "https://snap.stanford.edu/data/amazon0302.txt.gz"
        self.dataset_path = os.path.join(data_dir, "amazon0302.txt.gz")
        self.graph = None
        
        # Create data directory if it doesn't exist
        if not os.path.exists(data_dir):
            os.makedirs(data_dir)
    
    def download_dataset(self):
        """Download the Amazon0302 dataset if not already downloaded"""
        if not os.path.exists(self.dataset_path):
            print(f"Downloading dataset from {self.dataset_url}")
            wget.download(self.dataset_url, self.dataset_path)
            print("\nDownload complete!")
        else:
            print("Dataset already downloaded.")
    
    def load_graph(self):
        """Load the dataset into a NetworkX graph"""
        if not os.path.exists(self.dataset_path):
            self.download_dataset()
        
        print("Loading graph from dataset...")
        # Create a directed graph
        G = nx.DiGraph()
        
        # Read the gzipped file and parse edges
        with gzip.open(self.dataset_path, 'rt') as f:
            for line in f:
                # Skip comment lines
                if line.startswith('#'):
                    continue
                # Parse edge data (source node -> target node)
                source, target = map(int, line.strip().split())
                G.add_edge(source, target)
        
        self.graph = G
        print(f"Graph loaded: {len(G.nodes())} nodes, {len(G.edges())} edges")
        return self.graph
    
    def get_basic_stats(self):
        """Get basic statistics about the graph"""
        if self.graph is None:
            self.load_graph()
        
        G = self.graph
        
        # Basic stats
        num_nodes = len(G.nodes())
        num_edges = len(G.edges())
        
        # Graph density
        density = nx.density(G)
        
        # Calculate the strongest connected component
        largest_cc = max(nx.weakly_connected_components(G), key=len)
        largest_cc_size = len(largest_cc)
        
        # In-degree and out-degree stats
        in_degrees = [d for n, d in G.in_degree()]
        out_degrees = [d for n, d in G.out_degree()]
        
        avg_in_degree = sum(in_degrees) / len(in_degrees) if in_degrees else 0
        avg_out_degree = sum(out_degrees) / len(out_degrees) if out_degrees else 0
        max_in_degree = max(in_degrees) if in_degrees else 0
        max_out_degree = max(out_degrees) if out_degrees else 0
        
        # Degree distribution
        in_degree_counts = Counter(in_degrees)
        out_degree_counts = Counter(out_degrees)
        
        in_degree_dist = {k: v/num_nodes for k, v in sorted(in_degree_counts.items())}
        out_degree_dist = {k: v/num_nodes for k, v in sorted(out_degree_counts.items())}
        
        # Get top 10 nodes by degree (potential hubs)
        top_in_degree_nodes = sorted(G.in_degree(), key=lambda x: x[1], reverse=True)[:10]
        top_out_degree_nodes = sorted(G.out_degree(), key=lambda x: x[1], reverse=True)[:10]
        
        # Calculate average clustering coefficient (this can be slow for large graphs)
        # avg_clustering = nx.average_clustering(G)  # Uncommenting this may slow down processing
        
        # PageRank (identify important nodes)
        try:
            pagerank = list(nx.pagerank(G).items())
            top_pagerank_nodes = sorted(pagerank, key=lambda x: x[1], reverse=True)[:10]
        except:
            top_pagerank_nodes = []
            print("PageRank calculation failed, possibly due to graph complexity.")
        
        return {
            "basic_stats": {
                "num_nodes": num_nodes,
                "num_edges": num_edges,
                "density": density,
                "largest_cc_size": largest_cc_size,
                "largest_cc_percentage": (largest_cc_size / num_nodes) * 100,
                "avg_in_degree": avg_in_degree,
                "avg_out_degree": avg_out_degree,
                "max_in_degree": max_in_degree,
                "max_out_degree": max_out_degree
            },
            "degree_distribution": {
                "in_degree": dict(list(in_degree_dist.items())[:20]),  # First 20 items
                "out_degree": dict(list(out_degree_dist.items())[:20])  # First 20 items
            },
            "hubs": {
                "top_in_degree_nodes": top_in_degree_nodes,
                "top_out_degree_nodes": top_out_degree_nodes,
                "top_pagerank_nodes": top_pagerank_nodes
            }
        }
    
    def get_community_detection(self, algorithm="louvain", max_communities=10):
        """Detect communities in the graph using various algorithms"""
        if self.graph is None:
            self.load_graph()
        
        # For large graphs, we might want to use the largest connected component
        print("Extracting largest connected component for community detection...")
        largest_cc = max(nx.weakly_connected_components(self.graph), key=len)
        subgraph = self.graph.subgraph(largest_cc).copy()
        
        # Convert to undirected for community detection
        undirected_graph = subgraph.to_undirected()
        
        communities = []
        
        # Use NetworkX's community detection algorithms
        if algorithm == "louvain":
            try:
                import community as community_louvain
                partition = community_louvain.best_partition(undirected_graph)
                
                # Count nodes in each community
                community_counts = Counter(partition.values())
                
                # Get top communities
                top_communities = community_counts.most_common(max_communities)
                
                for i, (community_id, count) in enumerate(top_communities):
                    # Get nodes in this community
                    nodes = [node for node, comm_id in partition.items() if comm_id == community_id]
                    
                    # Calculate density of this community
                    community_subgraph = undirected_graph.subgraph(nodes)
                    density = nx.density(community_subgraph)
                    
                    communities.append({
                        "id": i + 1,  # Use 1-based indexing for display
                        "name": f"Community {i + 1}",
                        "count": count,
                        "percentage": (count / len(undirected_graph)) * 100,
                        "density": density,
                        "color": f"#{hash(community_id) % 0xffffff:06x}"  # Generate a color based on community_id
                    })
            except ImportError:
                print("python-louvain package not installed. Using Girvan-Newman instead.")
                algorithm = "girvan_newman"
        
        if algorithm == "girvan_newman":
            try:
                comp = list(nx.community.girvan_newman(undirected_graph))
                if len(comp) > 0:
                    # Take first iteration result
                    first_iteration = tuple(sorted(c) for c in next(iter(comp)))
                    
                    # Sort communities by size (largest first)
                    sorted_communities = sorted(first_iteration, key=len, reverse=True)
                    
                    for i, community in enumerate(sorted_communities[:max_communities]):
                        count = len(community)
                        community_subgraph = undirected_graph.subgraph(community)
                        density = nx.density(community_subgraph)
                        
                        communities.append({
                            "id": i + 1,
                            "name": f"Community {i + 1}",
                            "count": count,
                            "percentage": (count / len(undirected_graph)) * 100,
                            "density": density,
                            "color": f"#{hash(i) % 0xffffff:06x}"
                        })
            except Exception as e:
                print(f"Girvan-Newman failed: {e}")
        
        return communities
    
    def get_risk_analysis(self, num_suppliers=10):
        """
        Generate a mock risk analysis based on graph properties
        For a real implementation, this would incorporate domain knowledge
        """
        if self.graph is None:
            self.load_graph()
        
        # Use PageRank to identify important nodes (products)
        try:
            pagerank = nx.pagerank(self.graph)
            top_nodes = sorted(pagerank.items(), key=lambda x: x[1], reverse=True)[:50]
        except:
            # Fallback to degree centrality if PageRank fails
            centrality = nx.degree_centrality(self.graph)
            top_nodes = sorted(centrality.items(), key=lambda x: x[1], reverse=True)[:50]
        
        # Generate mock risk scores based on centrality and random factors
        risk_scores = []
        node_ids = [node for node, _ in top_nodes]
        
        np.random.seed(42)  # For reproducibility
        
        for i in range(min(num_suppliers, len(node_ids))):
            node = node_ids[i]
            
            # Base risk on node's importance (more central = more critical)
            base_risk = np.random.uniform(0.3, 0.9)
            
            # Add some network-based factors
            in_degree = self.graph.in_degree(node)
            out_degree = self.graph.out_degree(node)
            
            # Higher in-degree might mean more dependent on other suppliers
            in_degree_factor = min(in_degree / 20, 0.5)
            
            # Higher out-degree might mean more products depend on this supplier
            out_degree_factor = min(out_degree / 20, 0.5)
            
            # Calculate final risk score
            risk_score = (base_risk + in_degree_factor + out_degree_factor) / 3
            risk_score = min(risk_score, 0.95)  # Cap at 0.95
            
            # Generate reasons for the risk score
            reasons = []
            if in_degree > 10:
                reasons.append("High dependency on other suppliers")
            if out_degree > 10:
                reasons.append("Critical for many products")
            if base_risk > 0.7:
                reasons.append("Historical performance issues")
            if len(reasons) == 0:
                reasons.append("General supply chain position")
            
            # Add some randomized reasons
            possible_reasons = [
                "Geographic concentration risk",
                "Limited alternative sources",
                "Single sourcing for key components",
                "Long lead times",
                "Quality control challenges",
                "Contractual constraints",
                "Market volatility exposure"
            ]
            
            # Add 1-2 random reasons
            num_random = np.random.randint(1, 3)
            random_reasons = np.random.choice(possible_reasons, num_random, replace=False)
            reasons.extend(random_reasons)
            
            risk_scores.append({
                "supplier": f"Supplier-{node}",
                "score": float(risk_score),
                "reasons": reasons
            })
        
        return risk_scores

# Example usage
if __name__ == "__main__":
    analyzer = AmazonGraphAnalyzer()
    stats = analyzer.get_basic_stats()
    communities = analyzer.get_community_detection()
    risks = analyzer.get_risk_analysis()
    
    print("Basic Stats:")
    print(stats["basic_stats"])
    
    print("\nTop Communities:")
    for community in communities:
        print(f"Community {community['id']}: {community['count']} nodes, {community['percentage']:.2f}%")
    
    print("\nRisk Analysis:")
    for risk in risks:
        print(f"{risk['supplier']}: Score {risk['score']:.2f}, Reasons: {', '.join(risk['reasons'])}")
