# Eevee

**Evolving Supply Chain Resilience**

*Hackathon: [ArangoDB Hackathon](https://arangodbhackathon.devpost.com/)*  
*Dataset: [Amazon Co-Purchase Network](https://snap.stanford.edu/data/amazon0302.html)*  

## What It Does

Eevee uses graph analytics to evolve supply chains into resilient networks, analyzing the Amazon Co-Purchase dataset with synthetic suppliers and events. It clusters products and suppliers with Louvain detection, highlights risks, and answers queries like “Which suppliers are at risk?” using AI.

## Features

- Loads and persists the Amazon dataset in ArangoDB.
- Clusters the network with mock Louvain communities.
- Visualizes risks and communities in an interactive graph.
- Answers supply chain questions with an AI agent.

## Setup

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/JadeSamLee/eevee.git
   cd eevee
   ```

2. **Install Packages**:
   ```bash
   pip install networkx matplotlib plotly arango nx-arangodb langchain langchain-openai
   ```

3. **Add Credentials**:
   - Edit `eevee.ipynb` with your ArangoDB and OpenAI keys:
     ```python
     ARANGO_URL = "your-arangodb-url"
     ARANGO_USERNAME = "your-username"
     ARANGO_PASSWORD = "your-password"
     OPENAI_API_KEY = "your-openai-key"
     ```

## How to Run

1. **Execute the Script**:
   ```bash
   python eevee.py
   ```
   - Downloads the dataset.
   - Creates a sample graph (`community_analysis.html`).
   - Runs example queries.

2. **Sample Queries**:
   - "Which suppliers provide Product_1?" → "Nike."
   - "Which suppliers are at risk?" → "Nike and Adidas."

## Outputs

- `community_analysis.html`: Interactive graph with communities and risks.
- Console logs with supplier info.
  

- [ArangoDB](https://www.arangodb.com/) for the hackathon platform.
- [SNAP](https://snap.stanford.edu/) for the dataset.

