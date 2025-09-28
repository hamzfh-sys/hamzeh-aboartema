import React, { useState, useEffect, useMemo } from 'react';
import type { Branch, Report } from '../types';
import { BRANCHES } from '../constants';

interface HistoryScreenProps {
  onBack: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack }) => {
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [branchFilter, setBranchFilter] = useState<Branch | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('reportHistory');
      if (storedHistory) {
        setAllReports(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to delete all report history? This action cannot be undone.")) {
      localStorage.removeItem('reportHistory');
      setAllReports([]);
    }
  };

  const displayedReports = useMemo(() => {
    return allReports
      .filter(report => branchFilter === 'all' || report.branch === branchFilter)
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [allReports, branchFilter, sortOrder]);

  const summary = useMemo(() => {
    return {
      totalReports: displayedReports.length,
      totalAmt: displayedReports.reduce((sum, report) => sum + report.amt, 0),
      totalTrans: displayedReports.reduce((sum, report) => sum + report.trans, 0),
    };
  }, [displayedReports]);

  return (
    <div className="relative">
      <button onClick={onBack} className="absolute top-0 left-0 text-slate-500 hover:text-slate-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
        </svg>
      </button>

      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Report History</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-slate-100 p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-600">Total Reports</p>
            <p className="text-2xl font-bold text-slate-800">{summary.totalReports}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-600">Total Sales (AMT)</p>
            <p className="text-2xl font-bold text-green-800">{summary.totalAmt.toLocaleString()}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-600">Total Transactions</p>
            <p className="text-2xl font-bold text-blue-800">{summary.totalTrans.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <div className="flex-1 w-full">
          <label htmlFor="branchFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Branch</label>
          <select 
            id="branchFilter"
            value={branchFilter} 
            onChange={(e) => setBranchFilter(e.target.value as Branch | 'all')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
          >
            <option value="all">All Branches</option>
            {Object.values(BRANCHES).map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="flex-1 w-full">
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">Sort by Date</label>
          <select 
            id="sortOrder"
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="max-h-[40vh] overflow-y-auto space-y-4 pr-2">
        {displayedReports.length > 0 ? (
          displayedReports.map(report => (
            <div key={report.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{report.branch}</h3>
                  <p className="text-sm text-gray-500">{new Date(report.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-700"><span className="font-semibold">AMT:</span> {report.amt.toLocaleString()}</p>
                    <p className="text-sm text-gray-700"><span className="font-semibold">QTY:</span> {report.qty}</p>
                    <p className="text-sm text-gray-700"><span className="font-semibold">TRANS:</span> {report.trans}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t grid grid-cols-3 text-center">
                <p className="text-sm text-gray-700"><span className="font-semibold">ATV:</span> {report.atv}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">UPT:</span> {report.upt}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">ARP:</span> {report.arp}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No report history found.</p>
          </div>
        )}
      </div>

      {allReports.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleClearHistory}
            className="w-full max-w-xs bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition"
          >
            Clear All History
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryScreen;
