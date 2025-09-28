import React, { useState } from 'react';
import type { Branch, Report } from '../types';
import { BRANCHES } from '../constants';

interface InputScreenProps {
  branch: Branch;
  onBack: () => void;
}

const InputField: React.FC<{ id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, placeholder?: string }> = ({ id, label, value, onChange, type = "text", placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
        />
    </div>
);


const InputScreen: React.FC<InputScreenProps> = ({ branch, onBack }) => {
  const [qty, setQty] = useState('');
  const [amt, setAmt] = useState('');
  const [trans, setTrans] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const formatNumber = (num: number) => {
    return parseFloat(num.toFixed(2)).toString();
  };

  const saveReportToHistory = (report: Report) => {
    try {
      const existingHistoryJSON = localStorage.getItem('reportHistory');
      const history: Report[] = existingHistoryJSON ? JSON.parse(existingHistoryJSON) : [];
      history.unshift(report); // Add new report to the beginning
      localStorage.setItem('reportHistory', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save report to history:", e);
    }
  };

  const calculateAndFormatMessage = () => {
    setError('');
    
    if (!qty || !amt || !trans) {
      setError("ادخل جميع القيم بشكل صحيح");
      return;
    }

    const qtyNum = parseInt(qty, 10);
    const amtNum = parseFloat(amt);
    const transNum = parseInt(trans, 10);

    if (isNaN(qtyNum) || isNaN(amtNum) || isNaN(transNum) || qtyNum < 0 || amtNum < 0 || transNum < 0) {
        setError("ادخل جميع القيم بشكل صحيح");
        return;
    }

    let atv = "-";
    let upt = "-";
    let arp = "-";

    if (transNum > 0) {
      atv = formatNumber(amtNum / transNum);
      upt = formatNumber(qtyNum / transNum);
    }
    if (qtyNum > 0) {
      arp = formatNumber(amtNum / qtyNum);
    }

    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

    const newReport: Report = {
      id: Date.now().toString(),
      branch,
      date: date.toISOString(),
      qty: qtyNum,
      amt: amtNum,
      trans: transNum,
      atv,
      upt,
      arp,
    };
    saveReportToHistory(newReport);

    const reportData = {
        [BRANCHES.GALLERIA]: { qty: '', amt: '', trans: '', atv: '-', upt: '-', arp: '-' },
        [BRANCHES.MECCA]: { qty: '', amt: '', trans: '', atv: '-', upt: '-', arp: '-' },
        [BRANCHES.FASHION_GATE]: { qty: '', amt: '', trans: '', atv: '-', upt: '-', arp: '-' },
    };

    reportData[branch] = { qty: qty.toString(), amt: amt.toString(), trans: trans.toString(), atv, upt, arp };

    const finalMessage = `*${formattedDate}*

*KOTON galleria mall*
Qty: ${reportData[BRANCHES.GALLERIA].qty}
Amt: ${reportData[BRANCHES.GALLERIA].amt}
Trans: ${reportData[BRANCHES.GALLERIA].trans}

*KOTON Mecca*
Qty: ${reportData[BRANCHES.MECCA].qty}
Amt: ${reportData[BRANCHES.MECCA].amt}
Trans: ${reportData[BRANCHES.MECCA].trans}

*KOTON Fashion Gate*
Qty : ${reportData[BRANCHES.FASHION_GATE].qty}
Amt : ${reportData[BRANCHES.FASHION_GATE].amt}
Trans : ${reportData[BRANCHES.FASHION_GATE].trans}

*galleriamall* 
ATV:  ${reportData[BRANCHES.GALLERIA].atv}
Upt : ${reportData[BRANCHES.GALLERIA].upt}
Arp:  ${reportData[BRANCHES.GALLERIA].arp}

*Mecca mall*
ATV: ${reportData[BRANCHES.MECCA].atv}
Upt: ${reportData[BRANCHES.MECCA].upt}
Arp : ${reportData[BRANCHES.MECCA].arp}

*Fashion Gate*
ATV : ${reportData[BRANCHES.FASHION_GATE].atv}
Upt : ${reportData[BRANCHES.FASHION_GATE].upt}
Arp : ${reportData[BRANCHES.FASHION_GATE].arp}`;

    setMessage(finalMessage);
    
    // Hide keyboard by blurring active element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleCopy = () => {
    if (message) {
      navigator.clipboard.writeText(message).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };

  return (
    <div className="relative">
      <button onClick={onBack} className="absolute top-0 left-0 text-slate-500 hover:text-slate-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
        </svg>
      </button>

      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{branch}</h2>
        <p className="text-gray-500">Enter sales data</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <InputField id="qty" label="QTY" value={qty} onChange={(e) => setQty(e.target.value)} type="number" placeholder="e.g. 150"/>
        <InputField id="amt" label="AMT" value={amt} onChange={(e) => setAmt(e.target.value)} type="number" placeholder="e.g. 12550.75" />
        <InputField id="trans" label="TRANS" value={trans} onChange={(e) => setTrans(e.target.value)} type="number" placeholder="e.g. 100" />
      </div>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      
      <div className="flex justify-center mb-6">
          <button
              onClick={calculateAndFormatMessage}
              className="w-full max-w-xs bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
              احتساب
          </button>
      </div>
      
      {message && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Generated Report</h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono bg-white p-3 rounded border">{message}</pre>
          <div className="mt-4 flex justify-center">
            <button
                onClick={handleCopy}
                className={`w-full max-w-xs font-semibold py-2 px-4 rounded-lg shadow-md transition ${
                    copySuccess 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75'
                }`}
            >
                {copySuccess ? 'تم النسخ!' : 'نسخ الرسالة'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputScreen;