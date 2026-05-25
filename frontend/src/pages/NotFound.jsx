import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl"></div>

      <div className="text-center z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-4 rounded-2xl shadow-2xl">
            <Sparkles size={36} className="text-white animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-9xl font-extrabold text-white tracking-widest bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-transparent">
          404
        </h1>
        
        <h2 className="mt-4 text-2xl font-bold text-slate-200">
          Page Not Found
        </h2>
        
        <p className="mt-2 text-slate-400 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved. Let's get you back to track.
        </p>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 focus:outline-none transition-all duration-200"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
