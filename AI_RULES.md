# AI Rules for Breathin Application

This document outlines the core technologies and library usage guidelines for the Breathin web application. Adhering to these rules ensures consistency, maintainability, and optimal performance.

## Tech Stack Overview

*   **Frontend Framework**: React.js for building dynamic and interactive user interfaces.
*   **Language**: TypeScript for enhanced code quality, type safety, and improved developer experience.
*   **Styling**: Tailwind CSS for a utility-first approach to rapidly build custom designs and ensure responsiveness.
*   **UI Components**: Shadcn/ui for accessible, customizable, and pre-built UI components, leveraging Radix UI primitives.
*   **Routing**: React Router for declarative client-side navigation and URL management.
*   **Icons**: Lucide React for a comprehensive and easily customizable set of SVG icons.
*   **State Management**: React Context API for managing global application state, such as the shopping cart.
*   **Build Tool**: Vite for a fast and efficient development server and optimized production builds.
*   **Linting**: ESLint for enforcing code style and identifying potential issues.

## Library Usage Rules

*   **UI Components**: Always prioritize `shadcn/ui` components for all UI elements. If a specific component is not available or requires significant deviation, create a new, dedicated component file. **Do not modify `shadcn/ui` source files directly.**
*   **Styling**: Exclusively use Tailwind CSS classes for all styling. Avoid inline styles or separate CSS files unless absolutely necessary for specific third-party integrations.
*   **Icons**: Use `lucide-react` for all icon requirements across the application.
*   **Routing**: All client-side navigation must be handled using `react-router-dom`. Keep the main application routes defined within `src/App.tsx`.
*   **State Management**: For global application state, utilize React's Context API. For component-specific local state, use React's `useState` and `useReducer` hooks.
*   **Component Structure**: Every new component or hook, regardless of its size, must be created in its own dedicated file within `src/components/` or `src/hooks/`. Aim for components to be concise, ideally under 100 lines of code.
*   **Data Handling**: Currently, product data is managed locally in `src/data/products.ts`. If future features require external API integration, standard `fetch` API or a library like `axios` can be considered.
*   **Error Handling**: Do not implement `try/catch` blocks unless explicitly requested by the user. Errors should be allowed to bubble up to facilitate debugging and allow the AI to identify and resolve issues.
*   **Responsiveness**: All new features and components must be designed with responsiveness in mind, ensuring a seamless experience across various screen sizes.
*   **Notifications**: If a toast notification system is implemented, use it to provide clear and concise feedback to the user for important actions or events.