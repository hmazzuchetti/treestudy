import { Leaf } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-8 h-8 text-emerald-600 animate-pulse" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            TreeStudy
          </h1>
        </div>

        {/* Growing plant animation */}
        <div className="flex items-end justify-center gap-1 h-12">
          <div
            className="w-2 bg-emerald-500 rounded-full animate-pulse"
            style={{
              height: '20%',
              animationDelay: '0ms',
              animationDuration: '800ms'
            }}
          />
          <div
            className="w-2 bg-emerald-500 rounded-full animate-pulse"
            style={{
              height: '40%',
              animationDelay: '200ms',
              animationDuration: '800ms'
            }}
          />
          <div
            className="w-2 bg-emerald-600 rounded-full animate-pulse"
            style={{
              height: '80%',
              animationDelay: '400ms',
              animationDuration: '800ms'
            }}
          />
          <div
            className="w-2 bg-green-500 rounded-full animate-pulse"
            style={{
              height: '60%',
              animationDelay: '600ms',
              animationDuration: '800ms'
            }}
          />
          <div
            className="w-2 bg-green-500 rounded-full animate-pulse"
            style={{
              height: '30%',
              animationDelay: '800ms',
              animationDuration: '800ms'
            }}
          />
        </div>

        <p className="text-center text-emerald-600 mt-4 animate-pulse">
          Growing your focus...
        </p>
      </div>
    </div>
  );
}
