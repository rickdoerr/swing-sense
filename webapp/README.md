# Swing Sense Web Application

This is the frontend and core processing engine for Swing Sense. Built with **SvelteKit** and **Bun**, it handles real-time computer vision, 3D rendering, and biomechanical analysis directly in the browser.

## Tech Stack

*   **Runtime**: [Bun](https://bun.sh/) (Fast all-in-one JavaScript runtime)
*   **Framework**: SvelteKit (Vite-based)
*   **Computer Vision**: Google MediaPipe (Pose Landmarks)
*   **3D Rendering**: Three.js
*   **Analysis**: Custom TypeScript implementation of biomechanical physics
*   **Database**: SQLite (via `better-sqlite3`)
*   **Authentication**: Better Auth

## Key Architecture Modules

*   **`src/lib/processors`**: Contains the `PoseAnalyst` class which interfaces with MediaPipe to extract 3D landmarks from video streams.
*   **`src/lib/metrics`**:
    *   `SwingMetrics`: Calculates velocity, tempo, and positions.
    *   `Skeleton`: Manages the 3D representation of the golfer.
*   **`src/lib/rendering`**: Three.js scene management for visualizing the swing in 3D space.

## Development Setup

### Prerequisites
*   [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash`)

### Installation

1.  **Install Dependencies**
    ```bash
    bun install
    ```

2.  **Database Migration**
    Initialize the local SQLite database:
    ```bash
    bun run db:migrate
    ```

3.  **Run Development Server**
    ```bash
    bun run dev
    ```
    The app will be available at `http://localhost:3000`.

## Build for Production

```bash
bun run build
```