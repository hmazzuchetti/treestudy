# 🌱 TreeStudy - Focus & Grow PWA

A Progressive Web Application that helps you stay focused during study sessions using the Pomodoro technique, while visualizing your progress through a growing 3D plant.

## ✨ Features

- **🍅 Pomodoro Timer**: Customizable work/break intervals (default: 25min work, 5min break)
- **🌳 3D Plant Growth**: Watch your virtual plant grow as you complete study sessions
- **📱 Mobile-First PWA**: Works offline and can be installed on mobile devices
- **🎯 Point System**: Earn points for completed sessions to level up your plant
- **💾 Local Storage**: Your progress is saved locally - no account required
- **🎨 Beautiful UI**: Clean, minimalist design with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd treestudy
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Built With

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Three.js** - 3D Graphics
- **React Three Fiber** - React renderer for Three.js
- **TailwindCSS** - Styling
- **ShadCN UI** - UI Components
- **PWA** - Progressive Web App features
- **Playwright** - E2E Testing

## 📱 PWA Features

- ✅ Offline functionality
- ✅ Install prompt
- ✅ App manifest
- ✅ Service worker caching
- ✅ Mobile-responsive design

## 🧪 Testing

Run end-to-end tests with Playwright:

```bash
npm run test:e2e
```

Run tests in UI mode:

```bash
npm run test:ui
```

## 🏆 How It Works

1. **Start a Study Session**: Click the play button to begin a 25-minute focus session
2. **Stay Focused**: Work on your tasks while the timer counts down
3. **Earn Points**: Complete sessions to earn points (10 for work, 2 for breaks)
4. **Watch Your Plant Grow**: Your 3D plant evolves as you accumulate points
5. **Take Breaks**: Enjoy short breaks between sessions to stay refreshed

## 🌿 Plant Growth Stages

- 🌱 **Seed** (0-100 points): Starting small
- 🌿 **Sprout** (100-300 points): First signs of growth
- 🌳 **Sapling** (300-600 points): Getting taller
- 🌲 **Young Tree** (600-1000 points): Developing branches
- 🌳 **Mature Tree** (1000-2000 points): Full canopy
- 🌲 **Elder Tree** (2000+ points): Majestic and wise

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI base components
│   ├── Timer/          # Pomodoro timer components
│   ├── Plant/          # Three.js plant visualization
│   └── Layout/         # App layout components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── store/              # Context providers & state
├── types/              # TypeScript definitions
└── utils/              # Helper functions
```

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:e2e` - Run Playwright tests
- `npm run lint` - Run ESLint

## 🌐 Browser Support

- Modern browsers with ES2020+ support
- WebGL 1.0 for 3D plant visualization
- Service Worker API for PWA features
- localStorage for data persistence

## 🎯 Performance Targets

- First Contentful Paint < 2s
- Largest Contentful Paint < 4s
- Cumulative Layout Shift < 0.1
- First Input Delay < 100ms
- 90+ Lighthouse PWA score

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Pomodoro Technique by Francesco Cirillo
- 3D graphics powered by Three.js community
- UI components from ShadCN UI
- Icons from Lucide React
- This project uses some other projects as references, first the grass feature was developed based on Jerromy's project, you can find it here: https://github.com/JERROMY/JERROMY.github.io/tree/main/Grass_Basic

---

**Stay focused, watch your plant grow! 🌿**
