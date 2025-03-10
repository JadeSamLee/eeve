
# EEVE - Backend

This is the FastAPI backend for the Supply Chain Resilience App, which uses GraphRAG (Retrieval-Augmented Generation with graph data) to analyze supply chain disruptions.

## Features

- Process natural language queries about a supply chain graph
- Integrate with ArangoDB for graph storage and traversal
- Use LangChain for natural language to AQL conversion
- Leverage NVIDIA cuGraph for GPU-accelerated Louvain Community Detection
- Provide risk analysis and mitigation suggestions

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` and fill in your credentials:
   ```
   cp .env.example .env
   ```

4. Start the server:
   ```
   uvicorn main:app --reload
   ```

The server will be running at http://localhost:8000

## API Endpoints

- `POST /query`: Process a natural language query about the supply chain
  - Request: `{ "query": "Which suppliers provide Shoes?" }`
  - Response: JSON with query results and visualizations

- `GET /health`: Health check endpoint

## Docker Deployment

Build and run the Docker container:

```
docker build -t supply-chain-resilience-api .
docker run -p 8000:8000 supply-chain-resilience-api
```

