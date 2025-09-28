import React from 'react';
import type { Branch } from '../types';
import { BRANCHES } from '../constants';

interface BranchSelectionScreenProps {
  onSelectBranch: (branch: Branch) => void;
  onShowHistory: () => void;
}

const BranchSelectionScreen: React.FC<BranchSelectionScreenProps> = ({ onSelectBranch, onShowHistory }) => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center pt-8">Daily Report Generator</h1>
      <p className="text-gray-500 mb-8 text-center">Please select a branch to continue</p>
      <div className="w-full max-w-sm flex flex-col gap-4">
        {(Object.values(BRANCHES) as Branch[]).map((branch) => (
          <button
            key={branch}
            onClick={() => onSelectBranch(branch)}
            className="w-full bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            {branch}
          </button>
        ))}
        <button
          onClick={onShowHistory}
          className="w-full mt-4 bg-white text-slate-700 font-semibold py-3 px-4 rounded-lg shadow-md border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
        >
          View Report History
        </button>
      </div>
    </div>
  );
};

export default BranchSelectionScreen;