# TreeStudy - Focus & Grow PWA

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

TreeStudy is a Progressive Web Application (PWA) designed to help users focus on study sessions using the Pomodoro technique. The app features a 3D plant that grows as users accumulate study points, creating a gamified and motivating study experience.

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + ShadCN UI components
- **3D Graphics**: Three.js with React Three Fiber
- **PWA**: Vite PWA plugin with Workbox
- **Testing**: Playwright for E2E testing
- **State Management**: React Context API + Local Storage

## Architecture & Design Principles

### Core Features

1. **Pomodoro Timer**: Customizable work/break intervals (default: 25min work, 5min break)
2. **Point System**: Users earn points based on completed study sessions
3. **3D Plant Growth**: Visual representation of progress through an animated 3D plant
4. **Offline Support**: Full PWA functionality with service worker caching
5. **Mobile-First**: Responsive design optimized for mobile devices

### File Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI base components
│   ├── Timer/          # Pomodoro timer components
│   ├── Plant/          # Three.js plant visualization
│   └── Layout/         # App layout components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── store/              # Context providers and state management
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

### State Management Rules

- Use React Context for global state (timer, points, plant growth)
- Persist critical data (points, settings) in localStorage
- Keep component state minimal and focused
- Use custom hooks for complex logic and side effects

### Component Guidelines

- Follow composition over inheritance
- Use TypeScript interfaces for all props
- Implement proper error boundaries
- Ensure accessibility (ARIA labels, keyboard navigation)
- Mobile-first responsive design

### Three.js Integration

- Use React Three Fiber for declarative 3D scenes
- Implement plant growth through animated geometry transformations
- **Always use visual validation**: Take screenshots with Playwright when developing 3D features
- Optimize performance with proper cleanup and memoization
- Progressive enhancement - fallback for devices without WebGL support
- **Follow JERROMY's patterns**: When implementing 3D grass/plant features, reference JERROMY/JERROMY.github.io for proven techniques

### PWA Requirements

- Service worker for offline functionality
- App manifest with proper icons and metadata
- Caching strategy for static assets and API calls
- Install prompt for supported browsers
- Background sync for data persistence

### Testing Strategy

- Unit tests for utility functions and hooks
- Component testing with React Testing Library
- E2E testing with Playwright for critical user flows
- Performance testing for Three.js animations
- PWA testing across different browsers and devices

### Performance Optimization

- Lazy loading for Three.js components
- Image optimization and compression
- Bundle splitting and code splitting
- Efficient re-rendering patterns
- Memory management for 3D objects

### Code Style & Standards

- Use TypeScript strict mode
- Follow React hooks rules
- Implement proper error handling
- Use semantic HTML and ARIA attributes
- Consistent naming conventions (camelCase for variables, PascalCase for components)

### Data Persistence

- Store user progress in localStorage
- Implement data migration strategies for app updates
- Backup and restore functionality for user data
- Privacy-first approach - no external data collection

### UI/UX Guidelines

- Minimalist, clean design aesthetic
- Green color palette reflecting plant growth theme
- Smooth animations and transitions
- Clear visual feedback for user actions
- Intuitive navigation and controls

## Development Workflow

1. All new features should include TypeScript interfaces
2. Components must be responsive and accessible
3. **Visual Validation Required**: For any significant UI/3D changes, use Playwright browser tools to:
   - Navigate to the running app (http://localhost:5173/ or current port)
   - Take screenshots at different stages of development
   - Test interactive features (debug buttons, user controls)
   - Validate visual progression and user experience
   - Document visual changes with before/after comparisons
4. Test critical paths with Playwright
5. Optimize Three.js performance before committing
6. Update PWA manifest when adding new features

## Browser Support

- Modern browsers with ES2020+ support
- WebGL 1.0 for Three.js functionality
- Service Worker API for PWA features
- localStorage for data persistence

## Performance Targets

- First Contentful Paint < 2s
- Largest Contentful Paint < 4s
- Cumulative Layout Shift < 0.1
- First Input Delay < 100ms
- 90+ Lighthouse PWA score
