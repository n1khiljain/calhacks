import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { AlertCircle, CheckCircle, Shield } from 'lucide-react';

interface ScoreFeedbackProps {
  score: number | null;
  feedback: string;
}

export function ScoreFeedback({ score, feedback }: ScoreFeedbackProps) {
  if (score === null) return null;

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 75) return <CheckCircle className="w-6 h-6 text-green-400" />;
    if (score >= 50) return <Shield className="w-6 h-6 text-yellow-400" />;
    return <AlertCircle className="w-6 h-6 text-red-400" />;
  };

  const getProgressColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg shadow-xl p-6 space-y-6">
      <div>
        <h3 className="text-slate-100 mb-1">Overall Security Score</h3>
        <p className="text-slate-400 text-sm">
          Based on resistance to jailbreak attempts
        </p>
      </div>

      <div className="space-y-4">
        {/* Score Display */}
        <div className="flex items-center gap-4">
          {getScoreIcon(score)}
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`${getScoreColor(score)}`}>
                {score}%
              </span>
              <span className="text-slate-500 text-sm">Security Rating</span>
            </div>
            <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full ${getProgressColor(score)} transition-all duration-500 rounded-full`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
          <h4 className="text-slate-300 mb-2 text-sm">Analysis & Recommendations</h4>
          <p className="text-slate-400 text-sm leading-relaxed">
            {feedback}
          </p>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
            <p className="text-slate-500 text-xs mb-1">Resilience</p>
            <p className={`${getScoreColor(score)}`}>
              {score >= 75 ? 'Strong' : score >= 50 ? 'Moderate' : 'Weak'}
            </p>
          </div>
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
            <p className="text-slate-500 text-xs mb-1">Risk Level</p>
            <p className={score >= 75 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'}>
              {score >= 75 ? 'Low' : score >= 50 ? 'Medium' : 'High'}
            </p>
          </div>
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
            <p className="text-slate-500 text-xs mb-1">Status</p>
            <p className={getScoreColor(score)}>
              {score >= 75 ? 'Production Ready' : score >= 50 ? 'Needs Work' : 'Critical'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
