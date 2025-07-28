import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/hooks/useAppContext';
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  BookOpen,
  Clock,
  Target,
  Zap
} from 'lucide-react';

export const Timer: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { timer } = state;
  // Timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isRunning && timer.timeLeft > 0) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer.isRunning, timer.timeLeft, dispatch]);

  // Continuous point awarding for ecosystem testing (1 point every 5 seconds during work)
  useEffect(() => {
    let pointInterval: NodeJS.Timeout;

    if (timer.isRunning && timer.mode === 'work') {
      pointInterval = setInterval(() => {
        dispatch({ type: 'AWARD_CONTINUOUS_POINTS' });
      }, 5000); // Award 1 point every 5 seconds
    }

    return () => {
      if (pointInterval) {
        clearInterval(pointInterval);
      }
    };
  }, [timer.isRunning, timer.mode, dispatch]);

  // Handle timer completion
  useEffect(() => {
    if (timer.timeLeft === 0 && !timer.isRunning) {
      dispatch({ type: 'COMPLETE_SESSION' });

      // Auto-switch mode after completion
      const newMode = timer.mode === 'work' ? 'break' : 'work';
      setTimeout(() => {
        dispatch({ type: 'SWITCH_MODE', payload: newMode });
      }, 2000); // 2 second delay before switching
    }
  }, [timer.timeLeft, timer.isRunning, timer.mode, dispatch]);
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    return ((timer.totalTime - timer.timeLeft) / timer.totalTime) * 100;
  };

  const handleStart = () => {
    dispatch({ type: 'START_TIMER' });
  };

  const handlePause = () => {
    dispatch({ type: 'PAUSE_TIMER' });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_TIMER' });
  };

  const handleModeSwitch = (mode: 'work' | 'break') => {
    dispatch({ type: 'SWITCH_MODE', payload: mode });
  };
  return (
    <Card className="timer-container bg-gradient-to-br from-white to-green-50/50 border-green-200/50 shadow-lg">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          {timer.mode === 'work' ? (
            <BookOpen className="w-6 h-6 text-emerald-600" />
          ) : (
            <Coffee className="w-6 h-6 text-green-600" />
          )}
          <CardTitle className="text-2xl font-bold text-gray-900">
            {timer.mode === 'work' ? 'Focus Time' : 'Break Time'}
          </CardTitle>
        </div>
        <CardDescription className="text-gray-600">
          {timer.mode === 'work'
            ? 'Stay focused and watch your plant grow!'
            : 'Take a well-deserved break!'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Mode Selector */}
        <Tabs
          value={timer.mode}
          onValueChange={(value) => handleModeSwitch(value as 'work' | 'break')}
        >
          <TabsList className="grid w-full grid-cols-2 bg-green-100">
            <TabsTrigger
              value="work"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Work
            </TabsTrigger>
            <TabsTrigger
              value="break"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Coffee className="w-4 h-4 mr-1" />
              Break
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {/* Timer Display */}
        <div className="relative">
          <div className="flex flex-col items-center space-y-4">
            {/* Circular Progress */}
            <div className="relative w-56 h-56">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="3"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={timer.mode === 'work' ? '#059669' : '#16a34a'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 45 * (1 - getProgress() / 100)
                  }`}
                  className="transition-all duration-1000 ease-in-out"
                />
              </svg>

              {/* Timer content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className="text-5xl font-bold text-gray-900 mb-2"
                  data-testid="timer-display"
                >
                  {formatTime(timer.timeLeft)}
                </div>
                <Badge
                  variant="secondary"
                  className={`${
                    timer.mode === 'work'
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                      : 'bg-green-100 text-green-700 border-green-300'
                  }`}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {timer.mode} session
                </Badge>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round(getProgress())}%</span>
              </div>
              <Progress value={getProgress()} className="h-2" />
            </div>
          </div>
        </div>{' '}
        <Separator />
        {/* Control Buttons */}
        <div className="button-group justify-center">
          <Button
            onClick={timer.isRunning ? handlePause : handleStart}
            size="lg"
            className={`min-w-[140px] ${
              timer.mode === 'work'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
            data-testid="timer-control-button"
          >
            {timer.isRunning ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                {timer.isPaused ? 'Resume' : 'Start'}
              </>
            )}
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="border-gray-300 hover:bg-gray-50"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>
        {/* Debug Controls for Testing Ecosystem */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="text-sm font-medium text-amber-800 mb-2">
            🧪 Debug: Quick Ecosystem Testing
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => dispatch({ type: 'ADD_POINTS', payload: 10 })}
              size="sm"
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              +10 points
            </Button>
            <Button
              onClick={() => dispatch({ type: 'ADD_POINTS', payload: 25 })}
              size="sm"
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            >
              +25 points
            </Button>
            <Button
              onClick={() => dispatch({ type: 'ADD_POINTS', payload: 50 })}
              size="sm"
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              +50 points
            </Button>
          </div>
          <div className="text-xs text-amber-600 mt-2">
            Use these buttons to quickly test ecosystem growth phases without
            waiting!
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-green-200/50">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">
                Sessions
              </span>
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              {timer.completedSessions}
            </div>
          </div>

          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Streak</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {timer.completedSessions > 0
                ? Math.max(1, timer.completedSessions)
                : 0}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
