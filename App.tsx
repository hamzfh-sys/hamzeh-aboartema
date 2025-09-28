import React, { useState } from 'react';
import type { Branch } from './types';
import BranchSelectionScreen from './components/BranchSelectionScreen';
import InputScreen from './components/InputScreen';
import HistoryScreen from './components/HistoryScreen';

type View = 'branchSelection' | 'input' | 'history';

const App: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [view, setView] = useState<View>('branchSelection');

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    setView('input');
  };

  const handleBackToHome = () => {
    setSelectedBranch(null);
    setView('branchSelection');
  };
  
  const handleShowHistory = () => {
    setView('history');
  };

  const renderView = () => {
    switch (view) {
      case 'input':
        return selectedBranch ? <InputScreen branch={selectedBranch} onBack={handleBackToHome} /> : null;
      case 'history':
        return <HistoryScreen onBack={handleBackToHome} />;
      case 'branchSelection':
      default:
        return <BranchSelectionScreen onSelectBranch={handleBranchSelect} onShowHistory={handleShowHistory} />;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 sm:p-8 transform transition-all">
        {renderView()}
      </div>
    </div>
  );
};

export default App;
