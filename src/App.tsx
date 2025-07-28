import { Suspense } from 'react';
import { AppProvider } from '@/store/AppContext';
import { Timer } from '@/components/Timer/Timer';
import Plant from '@/components/Plant/Plant';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/hooks/useAppContext';
import { Leaf, Trophy, Timer as TimerIcon } from 'lucide-react';

function AppContent() {
  const { state } = useAppContext();
  const { plant, timer } = state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header with Stats */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-green-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Leaf className="w-7 h-7 text-emerald-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  TreeStudy
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 border-emerald-200"
              >
                <Trophy className="w-4 h-4 mr-1" />
                {plant.totalPoints} points
              </Badge>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 border-green-200"
              >
                <TimerIcon className="w-4 h-4 mr-1" />
                {timer.completedSessions} sessions
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Focus &
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              {' '}
              Grow
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Build focus habits with the Pomodoro technique while watching your
            virtual plant flourish. Every study session helps your plant grow
            stronger! 🌱
          </p>
        </div>

        {/* Main App Grid */}
        <div className="main-grid">
          {/* Timer Section */}
          <div className="order-2 lg:order-1">
            <Timer />
          </div>

          {/* Plant Visualization Section */}
          <div className="order-1 lg:order-2">
            <Card className="h-full bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200/50">
              <div className="p-6 h-full flex flex-col card-content">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Your Plant
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-emerald-600 border-emerald-300"
                  >
                    Level {Math.floor(plant.totalPoints / 100) + 1}
                  </Badge>
                </div>
                <Separator className="mb-6" />
                <div className="flex-1 min-h-[400px] bg-white/50 rounded-xl border border-green-200/50 overflow-hidden">
                  <Suspense
                    fallback={
                      <div className="w-full h-full flex flex-col items-center justify-center text-emerald-600">
                        <Leaf className="w-8 h-8 animate-pulse mb-2" />
                        <p>Growing your plant...</p>
                      </div>
                    }
                  >
                    <Plant />
                  </Suspense>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Keep studying to help your plant grow! 🌿
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white/50 backdrop-blur-sm border-t border-green-200/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <span className="text-gray-700 font-medium">TreeStudy</span>
          </div>
          <p className="text-gray-600 text-sm">
            Focus your mind, grow your plant, achieve your goals
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
