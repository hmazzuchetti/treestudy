# TreeStudy PWA - GitHub Copilot Instructions

<!-- Supercharged Copilot instructions for TreeStudy - A PWA productivity app with 3D ecosystem visualization -->

## 🌱 Project Overview

TreeStudy is a **Progressive Web Application (PWA)** that combines the **Pomodoro technique** with **gamified plant growth visualization**. Users study in focused sessions while watching a virtual **3D ecosystem grow** through Three.js, creating an engaging and motivating productivity experience.

### Core Concept  
**Focus Sessions → Points → Plant Growth → Ecosystem Development**

## 🏗️ Technical Architecture

### Modern Tech Stack
- **React 19** with **TypeScript** (latest features, strict typing)
- **Vite** with **HMR** (fast development, optimized builds)
- **Three.js + @react-three/fiber** (declarative 3D rendering)
- **Tailwind CSS + Radix UI** (utility-first styling, accessible components)
- **PWA** via vite-plugin-pwa (offline-first, native app experience)
- **Playwright** (comprehensive E2E testing with visual validation)
- **Framer Motion** (smooth UI animations)

### Project Structure & Architecture
```
src/
├── components/
│   ├── Timer/Timer.tsx          # 🔥 Pomodoro timer with circular progress
│   ├── Plant/                   # 🌿 3D ecosystem components
│   │   ├── Plant.tsx           # Main Canvas wrapper with OrbitControls
│   │   ├── JerromyGrassField.tsx # 8000+ instanced grass blades
│   │   └── Grass.tsx           # Individual grass blade logic
│   └── ui/                     # 🎨 Radix UI primitives (accessible)
├── store/AppContext.tsx         # 🏪 Global state (Context + useReducer)
├── hooks/useAppContext.ts       # 🪝 Context consumer hook
├── types/index.ts              # 📘 TypeScript definitions
└── lib/utils.ts                # 🛠️ Utility functions
```

## 🎯 Core Features & User Journey

### 1. **Pomodoro Timer System**
- **Work Sessions**: 25min (default) → 10 points + continuous growth (1pt/5sec)
- **Break Sessions**: 5min → 5 points
- **Visual Timer**: Circular progress with smooth animations
- **Mode Switching**: Work ↔ Break with auto-transitions
- **Debug Controls**: +10/+25/+50 point buttons for ecosystem testing

### 2. **Gamified Point & Growth System**
```typescript
const plantStages = [
  { stage: 'seed', minPoints: 0, maxPoints: 50, height: 0.1 },
  { stage: 'sprout', minPoints: 50, maxPoints: 150, height: 0.3 },
  { stage: 'sapling', minPoints: 150, maxPoints: 300, height: 0.6 },
  { stage: 'young', minPoints: 300, maxPoints: 500, height: 1.0 },
  { stage: 'mature', minPoints: 500, maxPoints: 800, height: 1.5 },
  { stage: 'elder', minPoints: 800, maxPoints: Infinity, height: 2.0 }
];
```

### 3. **3D Ecosystem Visualization**
- **Grass Field**: 8000 instanced grass blades with wind animation
- **Growth Progression**: Height/density based on accumulated points
- **Interactive Camera**: OrbitControls (zoom 2-40 units)
- **Performance Optimized**: Uses Three.js instancing for smooth 60fps

## 🧠 State Management Architecture

### Global State (AppContext + useReducer)
```typescript
interface AppState {
  timer: TimerState;     // Running state, time left, mode, sessions
  plant: PlantState;     // Points, level, current stage
  settings: AppSettings; // Durations, sound, notifications  
  progress: UserProgress; // Total time, streak, achievements
}

// Key Actions
dispatch({ type: 'START_TIMER' });
dispatch({ type: 'ADD_POINTS', payload: 25 });
dispatch({ type: 'COMPLETE_SESSION' });
dispatch({ type: 'SWITCH_MODE', payload: 'work' | 'break' });
```

### Data Persistence Strategy
- **Auto-save**: Every state change → localStorage
- **Recovery**: App startup → restore from localStorage with fallback
- **Migration**: Handle schema changes gracefully
- **Privacy**: No external tracking, all data local

## 🎨 UI/UX Design System

### Color Palette & Theme
- **Primary**: Emerald (`emerald-600`) for work mode
- **Secondary**: Green (`green-600`) for break mode  
- **Backgrounds**: Gradient overlays (`from-emerald-50 to-green-50`)
- **Glass Effects**: `bg-white/80 backdrop-blur-lg`

### Component Patterns
```tsx
// Standard card layout
<Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200/50">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Icon className="w-6 h-6 text-emerald-600" />
      Title
    </CardTitle>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
</Card>
```

### Responsive Design Rules
- **Mobile-first**: Start with mobile (375px+)
- **Breakpoints**: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- **Touch Targets**: Minimum 44px for buttons
- **Grid Layouts**: CSS Grid for main content areas

## 🔧 Three.js Performance & Patterns

### Optimization Strategies
```tsx
// Instancing for grass field (8000+ blades)
<instancedMesh ref={meshRef} args={[null, null, instances]}>
  <planeGeometry args={[0.1, 0.5]} />
  <meshLambertMaterial color={grassColor} />
</instancedMesh>

// Proper cleanup
useEffect(() => {
  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);
```

### Camera & Controls Setup
```tsx
<Canvas 
  camera={{ position: [0, 1.5, 4], fov: 70 }}
  gl={{ antialias: true }}
>
  <OrbitControls minDistance={2} maxDistance={40} />
</Canvas>
```

## 🧪 Testing & Quality Assurance

### Playwright E2E Testing Strategy
```typescript
// Critical user flows
test('timer functionality', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="timer-control-button"]');
  await expect(page.locator('[data-testid="timer-display"]')).toContain('24:59');
});

// Visual validation for 3D features
test('plant growth visualization', async ({ page }) => {
  await page.goto('/');
  await page.click('text="+25 points"');
  await page.screenshot({ path: 'plant-growth.png' });
});
```

### Test Coverage Requirements
- ✅ Timer start/pause/reset functionality
- ✅ Work/break mode switching  
- ✅ Point accumulation and plant growth
- ✅ Debug controls functionality
- ✅ PWA offline capability
- ✅ Mobile responsiveness
- ✅ 3D scene rendering and interactions

## ⚡ Performance Standards

### Core Web Vitals Targets
- **FCP** (First Contentful Paint): < 2s
- **LCP** (Largest Contentful Paint): < 4s  
- **CLS** (Cumulative Layout Shift): < 0.1
- **FID** (First Input Delay): < 100ms
- **Lighthouse PWA Score**: 90+

### Three.js Performance Guidelines
- Use `React.memo` for expensive 3D components
- Implement LOD (Level of Detail) for distant objects
- Dispose of geometries/materials on unmount
- Use `useFrame` sparingly, prefer declarative animations
- Monitor memory usage with dev tools

## 📱 PWA Implementation

### Manifest Configuration
```json
{
  "name": "TreeStudy - Focus & Grow",
  "short_name": "TreeStudy", 
  "display": "standalone",
  "theme_color": "#16a34a",
  "background_color": "#ffffff"
}
```

### Service Worker Strategy  
- **Static Assets**: Cache with CacheFirst
- **App Shell**: Cache with NetworkFirst 
- **User Data**: Store in localStorage + IndexedDB backup

## 🚀 Development Workflow & Best Practices

### Code Quality Checklist
- [ ] **TypeScript**: Strict typing, no `any` types
- [ ] **Accessibility**: ARIA labels, keyboard navigation, proper semantic HTML
- [ ] **Responsive**: Mobile-first design, tested on multiple breakpoints
- [ ] **Performance**: Memoization where needed, proper cleanup
- [ ] **Testing**: Playwright tests for user interactions

### Visual Validation Protocol (CRITICAL)
For any UI/3D changes, use Playwright MCP to:
1. **Navigate** to running app (`npm run dev` → http://localhost:5173)
2. **Screenshot** before/after states
3. **Test interactions**: Debug buttons, timer controls, 3D camera
4. **Document** visual progression with growth stages

### Git Workflow
```bash
# Development commands
npm run dev          # Vite dev server with HMR
npm run build        # Production build
npm run test:e2e     # Playwright E2E tests
npm run lint         # ESLint validation
```

### Feature Development Pattern
```tsx
// 1. Define types first
interface NewFeatureProps {
  prop1: string;
  prop2: number;
}

// 2. Build component with proper patterns
export const NewFeature: React.FC<NewFeatureProps> = ({ prop1, prop2 }) => {
  const { state, dispatch } = useAppContext();
  
  // 3. Add test data attributes
  return (
    <div data-testid="new-feature">
      {/* Component content */}
    </div>
  );
};

// 4. Write Playwright test
test('new feature works', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-testid="new-feature"]')).toBeVisible();
});
```

## 🎯 Success Metrics & Monitoring

### User Engagement
- Session completion rate
- Average focus time per session  
- Plant growth progression
- Return user percentage

### Technical Performance
- Bundle size < 500KB gzipped
- 3D rendering at 60fps
- Memory usage < 100MB
- Offline functionality 100% available

---

## 💡 Quick Reference Guide

### State Actions
```typescript
// Timer control
dispatch({ type: 'START_TIMER' });
dispatch({ type: 'PAUSE_TIMER' });
dispatch({ type: 'RESET_TIMER' });

// Growth system
dispatch({ type: 'ADD_POINTS', payload: 25 });
dispatch({ type: 'COMPLETE_SESSION' });
```

### Development URLs
- **Dev Server**: http://localhost:5173
- **Playwright UI**: `npm run test:ui`
- **Build Preview**: `npm run preview`

### Browser Support
- **ES2020+** features
- **WebGL 1.0** for Three.js  
- **Service Workers** for PWA
- **LocalStorage** for persistence

**Remember**: TreeStudy is about **focus**, **growth**, and **motivation**. Every feature should enhance the core experience of productive study sessions with engaging visual feedback. 🌱✨
