# GEMINI.md - Swing Sense Webapp Reference

## Project Overview
This project is a SvelteKit-based web application for analyzing golf swings ("Swing Sense"). It uses a modern stack optimized for performance and type safety.

**Key Technologies:**
*   **Runtime & Package Manager:** [Bun](https://bun.sh/) (Required)
*   **Framework:** SvelteKit (Vite-based)
*   **Styling:** TailwindCSS
*   **Database:** SQLite (local `sqlite.db`)
*   **Authentication:** Better Auth
*   **Visualization:** Three.js (3D rendering) & MediaPipe (Pose estimation)

## Architecture

The application follows standard SvelteKit conventions but separates core domain logic into dedicated modules within `src/lib`.

### Directory Structure

*   **/src/routes**: Application pages and API endpoints.
    *   **+page.svelte**: The main Single Page Application (SPA) entry point.
    *   **/api**: Backend API endpoints.
        *   `/session`: Session management logic.
        *   `/consent`: Cookie/User consent handling.
        *   `/run`: Endpoints for executing analysis pipelines (likely triggering agentic workflows or processing).

*   **/src/lib**: Core application code, shared between server and client where applicable.
    *   **/components**: Reusable Svelte UI components.
        *   `three-scene`, `pose-thumbnails`, `rotation-dial`: Visualization components.
        *   `agent-card`: Interaction interface for the AI agent.
    *   **/rendering**: 3D Graphics logic.
        *   `three-scene.ts`: Manages the Three.js scene graph.
        *   `skeleton.ts`: Handles 3D skeleton visualization from pose data.
    *   **/math**: 3D math and physics utilities.
    *   **/metrics**: Domain logic for calculating swing metrics (velocity, angles, etc.).
    *   **/processors**: Data processing pipelines (e.g., smoothing, filtering pose data).
    *   **/auth**: Authentication configuration (Better Auth).

### Data Flow
1.  **Input**: Video or real-time camera feed is processed (likely client-side via MediaPipe or uploaded).
2.  **Processing**: Raw landmarks are extracted and processed using `processors` and `math` modules.
3.  **Visualization**: Processed data is rendered in 3D using `src/lib/rendering` and displayed via components like `rotation-dial` and graphs.
4.  **Persistence**: User sessions and data are stored in SQLite via `better-auth` and server-side hooks.

## Development

**Prerequisites:**
*   Bun installed (`curl -fsSL https://bun.sh/install | bash`)

**Commands:**
*   **Install Dependencies:**
    ```bash
    bun install
    ```
*   **Start Dev Server:**
    ```bash
    bun run dev --port=3000
    ```
*   **Database Migration:**
    ```bash
    bun run db:migrate
    ```

**Notes:**
*   Always use `bun` instead of `npm` or `node` for scripts to ensure compatibility with the runtime environment.
*   The project uses `better-sqlite3` which requires native bindings; Bun handles this efficiently but be aware of platform specifics if deploying.
