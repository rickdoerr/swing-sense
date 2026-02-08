# Swing Sense AI Agent

The AI Agent service powers the personalized coaching feedback for Swing Sense. It is built using **Google's Agent Development Kit (ADK)** and leverages **Gemini** models to analyze biomechanical data.

## Architecture: The Parallel Agent Pattern

We utilize a **Parallel Agent** architecture to process complex swing data efficiently. Instead of a single prompt trying to analyze everything, we split the task among specialized sub-agents:

1.  **Address Agent**: Analyzes the golfer's stance, posture, and alignment before the swing begins.
2.  **Top of Swing Agent**: Evaluates shoulder rotation (X-Factor), hip turn, and club position at the apex of the backswing.
3.  **Impact Agent**: Analyzes the moment of contact, focusing on wrist angles and forward shaft lean.
4.  **Synthesis Agent**: Receives outputs from all the above, resolves conflicts, and generates a cohesive, friendly coaching summary for the user.

## Development Setup

### Prerequisites
*   Python 3.10+
*   Google Cloud Project with Gemini API enabled

### Installation

1.  **Create Virtual Environment**
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    ```

2.  **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Environment Configuration**
    Create a `.env` file with your Google API Key:
    ```bash
    GOOGLE_API_KEY=your_key_here
    ```

### Running the Agent

You can run the agent in two modes:

**1. API Server (For Webapp Connection)**
Starts the agent server that the SvelteKit app connects to.
```bash
adk api_server
```

**2. ADK Debugger (For Prompt Engineering)**
Opens a visual interface to chat with the agent and inspect internal thoughts/routing.
```bash
adk web
```