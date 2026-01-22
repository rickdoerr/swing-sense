# Swing Sense

A web app that analyzes golf swings using computer vision and Generative AI for coaching. 

## Features

- **Real-time Pose Estimation**: Uses MediaPipe to track 3D body landmarks directly from video input.
- **Advanced Swing Metrics**: Calculates key biomechanics including:
  - **Shoulder & Hip Rotation**: Measures body coil.
  - **X-Factor**: The separation angle between shoulders and hips.
  - **Wrist Velocity**: Tracks arm speed and identifies impact timing.
- **AI Coaching**: An integrated AI Agent (running Google ADK) analyses your calculated metrics to provide personalised, actionable feedback.

## Architecture

The project consists of a SvelteKit + Bun web application that handles the computer vision, geometry math, and data visualization. It communicates with a separate python service utilizing the Google Agent Development Kit (ADK) to process metrics and generate natural language coaching advice.

## Getting Started

### Docker 
Ensure you have Docker installed and running

```bash
git clone https://github.com/rickdoerr/swing-sense.git
./docker-build.sh
```

### Local Development

#### Agent
1.  **Create a virtual environment**
In the root of the project, create a new virtual environment:

```bash
cd swing-sense
python3 -m venv .venv
source .venv/bin/activate
```

2.  **Install dependencies**
Install all required packages from `requirements.txt`:

```bash
pip install -r agent/requirements.txt
adk --verion
```

3. **Add Google Gemini Credentials**
Create an .env file (see .env.example) and add your Gemini API key. You can obtain one from https://aistudio.google.com/. 

4.  **Run the Agent**
In the root of the project, either open the ADK debug web application using the ADK CLI:

```bash
adk web
```

or start the development server 

```bash
adk api_server
```

#### Webapp
The app is built with Bun, make sure it's installed on your machine, or visit https://bun.com/ to find out how to do that. With Bun installed: 

```bash
cd webapp
bun install
bun run dev --port=3000 --open
```