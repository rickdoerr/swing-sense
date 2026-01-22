# Swing Sense

A web app that analyzes golf swings using computer vision and Generative AI for coaching. 

## Features

- **Real-time Pose Estimation**: Uses MediaPipe to track 3D body landmarks directly from video input.
- **Advanced Swing Metrics**: Calculates key biomechanics including:
  - **Shoulder & Hip Rotation**: Measures body coil.
  - **X-Factor**: The separation angle between shoulders and hips.
  - **Wrist Velocity**: Tracks arm speed and identifies impact timing.

## Getting Started

### Local Development

#### Pose Estimator

```bash
bun install
bun run dev --open
```