import React from 'react';
import { ReasonItem, FrameworkType } from '../types';
import { Check, Flame, Atom, Heart, User, Infinity, Zap } from 'lucide-react';

interface Props {
  reason: ReasonItem;
  isChecked: boolean;
  onToggle: (id: string) => void;
  showCategoryTag?: string;
}

const getFrameworkIcon = (type: FrameworkType) => {
  switch (type) {
    case 'human_needs': return <Heart size={10} />;
    case 'jungian_libido': return <Flame size={10} />;
    case 'quantum_economics': return <Atom size={10} />;
    case 'relativity': return <Zap size={10} />;
    case 'cosmic_identity': return <User size={10} />;
    case 'taoist_reincarnation': return <Infinity size={10} />;
    default: return <Flame size={10} />;
  }
};

const getFrameworkLabel = (type: FrameworkType) => {
  switch (type) {
    case 'human_needs': return '6 Human Needs';
    case 'jungian_libido': return 'Jungian Drive';
    case 'quantum_economics': return 'Quantum Econ';
    case 'relativity': return 'Relativity';
    case 'cosmic_identity': return 'God Mode';
    case 'taoist_reincarnation': return '10 Lifetimes';
    default: return 'Reason';
  }
};

const getFrameworkColor = (type: FrameworkType) => {
    switch (type) {
      case 'human_needs': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'jungian_libido': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'quantum_economics': return 'text-cyan-600 bg-cyan-50 border-cyan-100';
      case 'relativity': return 'text-violet-600 bg-violet-50 border-violet-100';
      case 'cosmic_identity': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'taoist_reincarnation': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-gray-600 bg-gray-50';
    }
};

export const ActionCheckbox: React.FC<Props> = ({ reason, isChecked, onToggle, showCategoryTag }) => {
  return (
    <div 
      className={`group flex items-start gap-3 p-3 rounded-lg transition-all duration-300 border ${
        isChecked 
          ? 'bg-gradient-to-r from-emerald-50 to-white border-emerald-100' 
          : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-md'
      }`}
    >
      <button
        onClick={() => onToggle(reason.id)}
        className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
          isChecked
            ? 'bg-emerald-500 border-emerald-500 text-white scale-110'
            : 'bg-white border-gray-300 text-transparent hover:border-emerald-400'
        }`}
        title="Mark as Internalized"
      >
        <Check size={14} strokeWidth={3} />
      </button>

      <div className="flex-grow">
        <p 
          className={`text-sm leading-relaxed transition-all ${
            isChecked ? 'text-gray-400 italic' : 'text-gray-800 font-medium'
          }`}
        >
          {reason.description}
        </p>
        
        <div className="flex flex-wrap items-center gap-2 mt-2">
           <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${getFrameworkColor(reason.framework)}`}>
              {getFrameworkIcon(reason.framework)}
              {getFrameworkLabel(reason.framework)}
            </span>

          {showCategoryTag && (
             <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
               {showCategoryTag}
             </span>
          )}
        </div>
      </div>
    </div>
  );
};