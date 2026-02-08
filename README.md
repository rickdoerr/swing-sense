# Swing Sense

Visit [https://swingsense.golf/](https://swingsense.golf/).

**AI-Powered Golf Swing Analysis using Computer Vision & Google Gemini**

![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

Swing Sense is a cutting-edge web application that democratizes access to professional golf coaching. It uses **MediaPipe** for real-time skeletal tracking directly in the browser and leverages **Google's Agent Development Kit (ADK)** with **Gemini** to provide personalized, professional-grade coaching feedback.

## Features

*   **Real-time Pose Estimation**: Instant 3D body landmark tracking from video input using MediaPipe.
*   **Advanced Biometrics**:
    *   **X-Factor**: Calculates the separation angle between shoulders and hips (key for power).
    *   **Body Rotation**: Precise tracking of shoulder and hip turn.
    *   **Tempo & Velocity**: Measures arm speed and swing timing.
*   **AI Coach**: An intelligent agent pipeline (Address, Backswing, Impact) that analyzes your metrics and converses with you to fix faults.
*   **3D Visualization**: Interactive 3D rendering of your swing skeleton using Three.js.

## Architecture

The project is composed of two main services:

1.  **Web Application (SvelteKit + Bun)**: Handles the UI, computer vision, 3D rendering, and metric calculations.
2.  **AI Agent Service (Python + ADK)**: A parallel agent system that receives swing data, processes it through specialized sub-agents, and returns actionable feedback.

## Getting Started

### Docker (Recommended)

The easiest way to run the full stack is via Docker.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/rickdoerr/swing-sense.git
    cd swing-sense
    ```

2.  **Configure Environment**
    Create a `.env` file in the `agent` and `webapp` directory (see .env.example).
    
    For the agent, you need a Google Gemini API key:
    ```bash
    cp agent/.env.example agent/.env
    # Edit agent/.env and add GOOGLE_API_KEY=your_key_here
    ```

3.  **Build and Run**
    ```bash
    docker-compose up --build
    ```
    Access the app at `http://localhost:3000`.

### Manual Setup

If you prefer to run services individually for development, please refer to the specific documentation for each service:

*   **[Web Application Instructions](./webapp/README.md)** (Frontend & Processing)
*   **[AI Agent Instructions](./agent/README.md)** (Backend & Intelligence)