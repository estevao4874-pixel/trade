import React from 'react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export function BottomNav({ currentTab, setCurrentTab }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1E1E38] border-t border-slate-700/60 py-3 flex justify-around items-center z-50 shadow-2xl">
      <button onClick={() => setCurrentTab('home')} className={`flex flex-col items-center flex-1 transition-all ${currentTab === 'home' ? 'text-[#EAB308] font-black scale-105' : 'text-slate-400 font-bold'}`}>
        <span className="text-base mb-0.5">🏠</span>
        <span className="text-[9px] uppercase tracking-wider">Painel</span>
      </button>
      <button onClick={() => setCurrentTab('collection')} className={`flex flex-col items-center flex-1 transition-all ${currentTab === 'collection' ? 'text-[#EAB308] font-black scale-105' : 'text-slate-400 font-bold'}`}>
        <span className="text-base mb-0.5">📖</span>
        <span className="text-[9px] uppercase tracking-wider">Álbum</span>
      </button>
      <button onClick={() => setCurrentTab('countries')} className={`flex flex-col items-center flex-1 transition-all ${currentTab === 'countries' ? 'text-[#EAB308] font-black scale-105' : 'text-slate-400 font-bold'}`}>
        <span className="text-base mb-0.5">🌍</span>
        <span className="text-[9px] uppercase tracking-wider">Sedes</span>
      </button>
    </div>
  );
}