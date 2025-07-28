import React, { createContext, useReducer, useEffect } from 'react';
import type {
  TimerState,
  PlantState,
  AppSettings,
  UserProgress
} from '@/types';

interface AppState {
  timer: TimerState;
  plant: PlantState;
  settings: AppSettings;
  progress: UserProgress;
}

type AppAction =
  | { type: 'START_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'TICK_TIMER' }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'SWITCH_MODE'; payload: 'work' | 'break' }
  | { type: 'ADD_POINTS'; payload: number }
  | { type: 'AWARD_CONTINUOUS_POINTS' } // New action for testing
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'LOAD_STATE'; payload: AppState };

const initialState: AppState = {
  timer: {
    isRunning: false,
    isPaused: false,
    mode: 'work',
    timeLeft: 25 * 60, // 25 minutes in seconds
    totalTime: 25 * 60,
    completedSessions: 0
  },
  plant: {
    level: 1,
    totalPoints: 0,
    currentStage: {
      stage: 'seed',
      minPoints: 0,
      maxPoints: 50,
      height: 0.1,
      branches: 0,
      leaves: 0
    }
  },
  settings: {
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    soundEnabled: true,
    notificationsEnabled: true,
    pointsPerSession: 25,
    ecosystemSpeed: 1,
    renderQuality: 'medium'
  },
  progress: {
    totalStudyTime: 0,
    totalSessions: 0,
    streak: 0,
    lastStudyDate: '',
    achievements: []
  }
};

const plantStages = [
  {
    stage: 'seed',
    minPoints: 0,
    maxPoints: 50,
    height: 0.1,
    branches: 0,
    leaves: 0
  },
  {
    stage: 'sprout',
    minPoints: 50,
    maxPoints: 150,
    height: 0.3,
    branches: 1,
    leaves: 2
  },
  {
    stage: 'sapling',
    minPoints: 150,
    maxPoints: 300,
    height: 0.6,
    branches: 2,
    leaves: 8
  },
  {
    stage: 'young',
    minPoints: 300,
    maxPoints: 500,
    height: 1.0,
    branches: 4,
    leaves: 16
  },
  {
    stage: 'mature',
    minPoints: 500,
    maxPoints: 800,
    height: 1.5,
    branches: 6,
    leaves: 32
  },
  {
    stage: 'elder',
    minPoints: 800,
    maxPoints: Infinity,
    height: 2.0,
    branches: 8,
    leaves: 64
  }
] as const;

function getPlantStage(points: number) {
  return (
    plantStages.find(
      (stage) => points >= stage.minPoints && points < stage.maxPoints
    ) || plantStages[0]
  );
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: true,
          isPaused: false
        }
      };

    case 'PAUSE_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: false,
          isPaused: true
        }
      };
    case 'RESET_TIMER': {
      const resetTime =
        state.timer.mode === 'work'
          ? state.settings.workDuration * 60
          : state.settings.breakDuration * 60;
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: false,
          isPaused: false,
          timeLeft: resetTime,
          totalTime: resetTime
        }
      };
    }

    case 'TICK_TIMER':
      if (state.timer.timeLeft <= 1) {
        // Timer completed
        return {
          ...state,
          timer: {
            ...state.timer,
            isRunning: false,
            timeLeft: 0
          }
        };
      }
      return {
        ...state,
        timer: {
          ...state.timer,
          timeLeft: state.timer.timeLeft - 1
        }
      };
    case 'COMPLETE_SESSION': {
      const points = state.timer.mode === 'work' ? 10 : 5;
      const newPoints = state.plant.totalPoints + points;
      const newStage = getPlantStage(newPoints);

      return {
        ...state,
        timer: {
          ...state.timer,
          completedSessions: state.timer.completedSessions + 1
        },
        plant: {
          ...state.plant,
          totalPoints: newPoints,
          currentStage: newStage
        },
        progress: {
          ...state.progress,
          totalSessions: state.progress.totalSessions + 1,
          totalStudyTime:
            state.progress.totalStudyTime +
            (state.timer.mode === 'work' ? state.settings.workDuration : 0)
        }
      };
    }
    case 'SWITCH_MODE': {
      const duration =
        action.payload === 'work'
          ? state.settings.workDuration
          : state.settings.breakDuration;
      return {
        ...state,
        timer: {
          ...state.timer,
          mode: action.payload,
          timeLeft: duration * 60,
          totalTime: duration * 60,
          isRunning: false,
          isPaused: false
        }
      };
    }
    case 'ADD_POINTS': {
      const updatedPoints = state.plant.totalPoints + action.payload;
      const updatedStage = getPlantStage(updatedPoints);
      return {
        ...state,
        plant: {
          ...state.plant,
          totalPoints: updatedPoints,
          currentStage: updatedStage
        }
      };
    }

    case 'AWARD_CONTINUOUS_POINTS': {
      // Award 1 point every 5 seconds while timer is running (for testing ecosystem growth)
      if (state.timer.isRunning && state.timer.mode === 'work') {
        const updatedPoints = state.plant.totalPoints + 1;
        const updatedStage = getPlantStage(updatedPoints);
        return {
          ...state,
          plant: {
            ...state.plant,
            totalPoints: updatedPoints,
            currentStage: updatedStage
          }
        };
      }
      return state;
    }

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
}

const AppContext = createContext<
  | {
      state: AppState;
      dispatch: React.Dispatch<AppAction>;
    }
  | undefined
>(undefined);

export { AppContext };

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('treestudy-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({
          type: 'LOAD_STATE',
          payload: { ...initialState, ...parsed }
        });
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('treestudy-state', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}{' '}
    </AppContext.Provider>
  );
};
