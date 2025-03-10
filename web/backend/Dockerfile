
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies required for some Python packages
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create data directory
RUN mkdir -p ./data

COPY . .

# Download the dataset during build (optional, can also happen at runtime)
# RUN python -c "from graph_analysis import AmazonGraphAnalyzer; AmazonGraphAnalyzer().download_dataset()"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
