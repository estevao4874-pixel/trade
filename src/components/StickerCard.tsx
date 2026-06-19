import React from 'react';

interface Sticker {
  id: string;
  number: string;
  player_name: string;
  team: string;
  category: 'Jogador' | 'Escudo' | 'Estádio' | 'Mascote' | 'Especial';
  rarity: 'Comum' | 'Rara' | 'Brilhante';
  position: string;
  current_club: string;
  image_url: string;
  quantity: number;
}

interface StickerCardProps {
  sticker: Sticker;
  onAdd: () => void;
  onRemove: () => void;
  isFlipped: boolean;
  onFlip: () => void;
}

export function StickerCard({ sticker, onAdd, onRemove, isFlipped, onFlip }: StickerCardProps) {
  const obtida = sticker.quantity > 0;

  const getEstiloBorda = () => {
    if (sticker.rarity === 'Brilhante') {
      return 'border-[#EAB308] bg-gradient-to-b from-[#3a3014] to-[#1E1E38] shadow-[0_0_10px_rgba(234,179,8,0.2)]';
    }
    if (sticker.rarity === 'Rara') {
      return 'border-[#2563EB] bg-gradient-to-b from-[#142344] to-[#1E1E38]';
    }
    return 'border-slate-700 bg-[#1E1E38]';
  };

  return (
    <div className="w-full aspect-[3/4] perspective-1000 select-none cursor-pointer" onClick={onFlip}>
      <div className={`w-full h-full duration-500 transform-style-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* FRENTE DA FIGURINHA */}
        <div className={`absolute inset-0 backface-hidden border-2 rounded-2xl p-2 flex flex-col justify-between transition-all ${getEstiloBorda()} ${!obtida ? 'opacity-25 grayscale' : ''}`}>
          <div className="flex justify-between items-center w-full">
            <span className="bg-[#2563EB] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md font-mono">{sticker.number}</span>
            {sticker.quantity > 1 && (
              <span className="bg-[#10B981] text-white text-[9px] font-black h-4 px-1.5 flex items-center justify-center rounded-md">+{sticker.quantity - 1}</span>
            )}
          </div>

          <div className="text-center my-auto w-full">
            <span className="text-xl block mb-1">{sticker.image_url || '🏃‍♂️'}</span>
            <p className="text-white font-black text-[10px] leading-tight line-clamp-1 px-0.5">{sticker.player_name}</p>
            <p className="text-[8px] text-[#EAB308] font-bold uppercase tracking-wider mt-0.5 truncate">{sticker.team}</p>
          </div>

          <div className="flex gap-1 w-full z-20" onClick={e => e.stopPropagation()}>
            <button onClick={onRemove} disabled={sticker.quantity === 0} className="flex-1 bg-black/40 text-rose-400 border border-slate-700 disabled:opacity-10 rounded-md text-[10px] font-black py-0.5">-</button>
            <button onClick={onAdd} className="flex-1 bg-[#10B981] text-white rounded-md text-[10px] font-black py-0.5">+</button>
          </div>
        </div>

        {/* VERSO DA FIGURINHA (DADOS REAIS SEM CAMPOS EM BRANCO) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 border-2 border-[#EAB308]/30 bg-[#111122] rounded-2xl p-2.5 flex flex-col justify-between text-center">
          <div className="bg-[#1E1E38] border border-slate-700 rounded py-0.5 text-[8px] font-black text-slate-400 font-mono">
            {sticker.number} • DADOS TÉCNICOS
          </div>
          <div className="space-y-1 text-left my-auto text-[9px] px-0.5">
            <p className="text-slate-400 truncate">Clube: <span className="text-white font-bold">{sticker.current_club}</span></p>
            <p className="text-slate-400 truncate">Posição: <span className="text-[#10B981] font-bold">{sticker.position}</span></p>
            <p className="text-slate-400">Tipo: <span className="text-slate-200">{sticker.category}</span></p>
          </div>
          <span className={`text-[8px] font-black uppercase py-0.5 rounded-md ${obtida ? 'text-[#10B981] bg-[#10B981]/5' : 'text-rose-400 bg-rose-500/5'}`}>
            {obtida ? '✓ Na Coleção' : 'Faltando'}
          </span>
        </div>

      </div>
    </div>
  );
}