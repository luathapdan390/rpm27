import React, { useMemo } from 'react';
import { RPMCategory, CompletionState } from '../types';
import { ActionCheckbox } from './ActionCheckbox';
import { Target, Zap } from 'lucide-react';

interface Props {
  category: RPMCategory;
  completionStatus: CompletionState;
  onToggleAction: (id: string) => void;
}

export const RPMBlock: React.FC<Props> = ({ category, completionStatus, onToggleAction }) => {
  
  const progress = useMemo(() => {
    const total = category.reasons.length;
    if (total === 0) return 0;
    const completed = category.reasons.filter(a => completionStatus[a.id]).length;
    return Math.round((completed / total) * 100);
  }, [category.reasons, completionStatus]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Header Section */}
      <div className="p-5 bg-gradient-to-br from-slate-50 to-indigo-50/20 border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">{category.name}</h3>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${progress === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
            {progress}% Realized
          </span>
        </div>
        
        {/* Outcome (R) */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-blue-600 mb-1">
            <Target size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Desired Outcome</span>
          </div>
          <p className="text-sm text-slate-700 font-semibold leading-relaxed">
            {category.outcome}
          </p>
        </div>

        {/* Purpose (P) */}
        <div>
           <div className="flex items-center gap-1.5 text-purple-600 mb-1">
            <Zap size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Core Purpose</span>
          </div>
          <p className="text-xs text-slate-500 italic leading-relaxed">
            "{category.purpose}"
          </p>
        </div>
      </div>

      {/* Massive Reason Matrix */}
      <div className="p-4 flex-grow bg-slate-50/30">
         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1 flex justify-between items-center">
            <span>Massive Reason Matrix</span>
            <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 rounded">{category.reasons.length} Reasons</span>
         </h4>
         <div className="space-y-3">
           {category.reasons.map(reason => (
             <ActionCheckbox 
                key={reason.id}
                reason={reason}
                isChecked={!!completionStatus[reason.id]}
                onToggle={onToggleAction}
             />
           ))}
         </div>
      </div>
    </div>
  );
};