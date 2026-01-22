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

#### Docker 
TODO

#### Local Development