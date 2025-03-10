
# Supply Chain Resilience App - GraphRAG Hackathon Project

This project is a full-stack web application that uses GraphRAG (Retrieval-Augmented Generation with graph data) to analyze supply chain disruptions, integrating ArangoDB, LangChain, and NVIDIA cuGraph for GPU-accelerated graph analytics.

## Features

- Process natural language queries about a supply chain graph
- Visualize supplier risk clusters identified by Louvain community detection
- Display risk scores with detailed breakdown
- Provide actionable mitigation strategies

## Project Structure

- **Frontend**: React app with Tailwind CSS for styling
  - Natural language query interface
  - Interactive visualizations for risk clusters and scores
  - Responsive design with modern UI components

- **Backend**: FastAPI Python server
  - Integration with ArangoDB for graph storage
  - LangChain for natural language processing
  - NVIDIA cuGraph for advanced graph analytics

## Setup and Running

### Frontend

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

The frontend will be running at http://localhost:5173

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Copy `.env.example` to `.env` and fill in your credentials:
   ```
   cp .env.example .env
   ```

5. Start the server:
   ```
   uvicorn main:app --reload
   ```

The backend will be running at http://localhost:8000

## Configuration

- By default, the frontend uses mock data for demonstration purposes
- To connect to the real backend, set `VITE_USE_MOCK_DATA=false` in the `.env` file

## Technologies Used

- **Frontend**: React, Tailwind CSS, Plotly.js
- **Backend**: FastAPI, ArangoDB, LangChain, NVIDIA cuGraph
- **Data**: Sample supply chain graph with suppliers, products, and disruption events

## Development Notes

- This project was created for a hackathon demonstration
- The backend includes both mock implementations for quick testing and commented code for actual implementations
- For production use, additional security measures and error handling would be required

## Future Enhancements

- Fetch real supply chain data from UN Comtrade API
- Implement user authentication and data persistence
- Add more sophisticated visualization options
- Enhance the query parsing with more advanced NLP techniques

## License

MIT
