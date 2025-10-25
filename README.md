# Cognition Stream

Cognition Stream from Vers3Dynamics is an interactive 3D web application that visualizes abstract concepts of consciousness. It uses a modern web stack, including Vite, React, and TypeScript, to render a dynamic scene with multiple layers representing different aspects of the mind. The project leverages `react-three-fiber` for 3D rendering and `shadcn/ui` for the user interface components.

## Technologies Used

- **Core:** React, Vite, TypeScript
- **UI:** shadcn/ui, Tailwind CSS
- **3D:** `react-three-fiber`, `three.js`
- **Routing:** `react-router-dom`
- **Data Fetching:** `@tanstack/react-query`
- **Forms:** `react-hook-form`, `zod`
- **Linting:** ESLint

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone topherchris420/cognition-stream.git
   cd cognition-stream
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the development server:**
   ```sh
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or the next available port).

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run lint`: Lints the code using ESLint to find and fix problems.
- `npm run preview`: Serves the production build locally for previewing.

## Project Structure

    .
    ├── public              # Static assets like images and icons
    ├── src
    │   ├── components      # React components
    │   │   ├── consciousness # 3D visualization components
    │   │   └── ui            # UI components from shadcn/ui
    │   ├── hooks           # Custom React hooks
    │   ├── lib             # Utility functions
    │   ├── pages           # Application pages
    │   ├── App.tsx         # Main application component with routing
    │   └── main.tsx        # Entry point of the application
    ├── .eslintrc.cjs       # ESLint configuration
    ├── index.html          # Main HTML file
    ├── package.json        # Project metadata and dependencies
    ├── tailwind.config.js  # Tailwind CSS configuration
    └── vite.config.ts      # Vite configuration
