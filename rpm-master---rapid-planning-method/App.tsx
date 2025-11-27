import React, { useState, useEffect, useMemo } from 'react';
import { RPMPlan, CompletionState, ReasonItem } from './types';
import { generateRPMPlan } from './services/geminiService';
import { RPMBlock } from './components/RPMBlock';
import { ActionCheckbox } from './components/ActionCheckbox';
import { BrainCircuit, Loader2, Sparkles, LayoutList, Trophy, RotateCcw, Check, Zap } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'rpm_master_data_v2';

export default function App() {
  // Input State
  const [tasks, setTasks] = useState('');
  const [goals, setGoals] = useState('');
  
  // App Logic State
  const [plan, setPlan] = useState<RPMPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<CompletionState>({});
  const [error, setError] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPlan(parsed.plan);
        setCompletionStatus(parsed.completionStatus || {});
      } catch (e) {
        console.error("Failed to load saved data");
      }
    }
  }, []);

  // Save to local storage whenever plan or status changes
  useEffect(() => {
    if (plan) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ plan, completionStatus }));
    }
  }, [plan, completionStatus]);

  const handleGenerate = async () => {
    if (!tasks.trim() && !goals.trim()) {
        setError("Please enter what's on your mind first.");
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const generatedPlan = await generateRPMPlan(tasks, goals);
      setPlan(generatedPlan);
      setCompletionStatus({}); // Reset status on new plan
    } catch (err: any) {
      setError(err.message || "Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAction = (id: string) => {
    setCompletionStatus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleReset = () => {
      if(window.confirm("Start over? This will clear your current Matrix.")) {
          setPlan(null);
          setTasks('');
          setGoals('');
          setCompletionStatus({});
          localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
  };

  // Derived Statistics
  const stats = useMemo(() => {
    if (!plan) return { total: 0, completed: 0, percent: 0 };
    let total = 0;
    let completed = 0;
    plan.categories.forEach(cat => {
      cat.reasons.forEach(r => {
        total++;
        if (completionStatus[r.id]) completed++;
      });
    });
    return {
      total,
      completed,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100)
    };
  }, [plan, completionStatus]);

  // Derived Daily Top 5 Data
  const dailyTop5Reasons = useMemo(() => {
    if (!plan) return [];
    const top5: { reason: ReasonItem; categoryName: string }[] = [];
    
    // Create a map for quick lookup
    const reasonMap = new Map<string, { reason: ReasonItem; categoryName: string }>();
    plan.categories.forEach(cat => {
        cat.reasons.forEach(r => {
            reasonMap.set(r.id, { reason: r, categoryName: cat.name });
        });
    });

    plan.dailyTop5Ids.forEach(id => {
        const found = reasonMap.get(id);
        if (found) top5.push(found);
    });

    return top5;
  }, [plan]);

  return (
    <div className="min-h-screen pb-20 bg-[#f8fafc]">
      
      {/* Navbar */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-emerald-400" />
            <h1 className="text-xl font-bold tracking-tight">RPM: 100 Reasons Matrix</h1>
          </div>
          {plan && (
             <button 
                onClick={handleReset}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
             >
                <RotateCcw size={16} />
                New Matrix
             </button>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* INPUT MODE */}
        {!plan && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">The Purpose Generator</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Transform your goals into a "Massive Reason Matrix" using 6 dimensions of philosophy: 
                Tony Robbins, Jungian Psychology, Quantum Economics, Relativity, Cosmic Identity, and Taoist Reincarnation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <LayoutList size={16} className="text-blue-500" />
                  Brain Dump (Current Status)
                </label>
                <textarea
                  className="w-full h-64 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none shadow-sm text-sm"
                  placeholder="I'm feeling stuck with my business...&#10;I want to get fit but I'm lazy...&#10;I need to write my book..."
                  value={tasks}
                  onChange={(e) => setTasks(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Trophy size={16} className="text-amber-500" />
                  Desired Outcomes (Dreams)
                </label>
                <textarea
                  className="w-full h-64 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none shadow-sm text-sm"
                  placeholder="Become the fittest version of myself...&#10;Earn 10x income...&#10;Impact millions of lives..."
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                />
              </div>
            </div>

            {error && (
               <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-100">
                 {error}
               </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:-translate-y-1"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Consulting the Council of Sages...
                </>
              ) : (
                <>
                  <Sparkles className="text-emerald-400" />
                  Generate 100 Reasons Matrix
                </>
              )}
            </button>
            <p className="text-xs text-center text-slate-400 mt-4">Powered by Gemini 2.5 • Tony Robbins • Carl Jung • Einstein • The Tao</p>
          </div>
        )}

        {/* RESULTS MODE */}
        {plan && (
          <div className="animate-fade-in-up">
            
            {/* Dashboard Header */}
            <div className="mb-8 grid md:grid-cols-3 gap-6">
              {/* Progress Card */}
              <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Zap size={100} />
                </div>
                <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">Internalization Level</h3>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-5xl font-bold">{stats.percent}%</span>
                  <span className="text-slate-400 mb-1">realized</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    style={{ width: `${stats.percent}%` }}
                  />
                </div>
                <div className="mt-4 text-xs text-slate-400 flex justify-between font-mono">
                    <span>{stats.completed} sparks</span>
                    <span>{stats.total} total reasons</span>
                </div>
              </div>

              {/* Daily Top 5 */}
              <div className="md:col-span-2 bg-gradient-to-br from-indigo-900 to-blue-900 rounded-xl p-6 text-white shadow-xl ring-1 ring-white/10">
                <h3 className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                   <Sparkles size={14} className="text-yellow-400"/>
                   Daily Top 5: Meditate on These
                </h3>
                <div className="space-y-3">
                    {dailyTop5Reasons.map(({ reason, categoryName }) => (
                         <div key={`top5-${reason.id}`} className="group bg-white/5 backdrop-blur-sm rounded-lg p-3 flex items-start gap-3 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => toggleAction(reason.id)}>
                            <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${completionStatus[reason.id] ? 'bg-emerald-500 border-emerald-500' : 'border-indigo-300/30 group-hover:border-indigo-300'}`}>
                                {completionStatus[reason.id] && <Check size={12} strokeWidth={3} />}
                            </div>
                            <div>
                                <p className={`text-sm leading-snug ${completionStatus[reason.id] ? 'line-through opacity-50' : 'text-indigo-50'}`}>{reason.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wide">{categoryName}</p>
                                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                    <p className="text-[10px] text-white/40 uppercase">{reason.framework.replace('_', ' ')}</p>
                                </div>
                            </div>
                         </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Categories Grid */}
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
               <LayoutList className="text-slate-500" />
               The 100 Reason Matrix
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plan.categories.map(category => (
                <RPMBlock 
                  key={category.id}
                  category={category}
                  completionStatus={completionStatus}
                  onToggleAction={toggleAction}
                />
              ))}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}