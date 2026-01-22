FROM python:3.11-slim

WORKDIR /app

# Install system dependencies if any (usually none for basic python)
# RUN apt-get update && apt-get install -y ...

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port 8000
EXPOSE 8000
ENV HOST=0.0.0.0
ENV UVICORN_HOST=0.0.0.0


# Command to run the agent. 
# Assuming 'agent.py' contains `root_agent`.
# ADK agents can be run via CLI `adk run agent.py:root_agent` or similar.
# However, `adk run` usually starts a development server with FastAPI.
# Let's assume the standard way is `adk run agent.py`.
# If it uses uvicorn under the hood, we can also invoke uvicorn directly if we knew the app object.
# But `adk run` is safer.
CMD ["adk", "api_server", "--host", "0.0.0.0"]
