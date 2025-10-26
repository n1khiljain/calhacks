import React, { useState } from 'react';
import { TestInterface } from './features/test/TestInterface';
import { ResultsTable } from './features/test/ResultsTable';
import { ScoreFeedback } from './features/test/ScoreFeedback';
import { AnalysisSection } from './features/test/AnalysisSection';
import { HomePage } from './features/home/HomePage';
import { ShieldCheck } from 'lucide-react';
import { Button } from './components/ui/button';
import { TypingAnimation } from './components/ui/typing-animation';
import { FlickeringGrid } from "@/components/ui/flickering-grid"


export interface TestResult {
  id: string;
  input: string;
  output: string;
  status: 'pass' | 'fail';
  explanation: string;
  classifiers?: any;
  timestamp: Date;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'test'>('home');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  const handleRunTest = (systemPrompt: string, results?: any[], score?: number, vulnerabilities?: number) => {
    if (results && score !== undefined && vulnerabilities !== undefined) {
      // Use real Groq data
      setTestResults(results);
      setOverallScore(score);
      
      // Generate feedback based on real score
      if (score >= 80) {
        setFeedback("Excellent security! Your AI system shows strong resistance to jailbreak attempts.");
      } else if (score >= 60) {
        setFeedback("Good security with room for improvement. Consider strengthening your system prompt.");
      } else {
        setFeedback("Security needs attention. Your AI system is vulnerable to several attack methods.");
      }
    } else {
      // Fallback if backend fails
      setTestResults([]);
      setOverallScore(0);
      setFeedback("Unable to connect to security testing service. Please ensure the backend is running.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-700 relative">
      <FlickeringGrid
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      flickerChance={0.2}
      maxOpacity={0.4}
      color="rgb(59, 130, 246)"
      width={typeof window !== 'undefined' ? window.innerWidth : 1920}
      height={typeof window !== 'undefined' ? window.innerHeight : 1080}
      />
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        <header className="max-w-7xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg">
          <div className="px-6 py-2.5">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage('home')}
                className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              >
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <TypingAnimation
                  className="text-slate-900 tracking-tight text-lg font-semibold"
                  style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", letterSpacing: '-0.02em' }}
                  duration={150}
                  showCursor={false}
                >
                  breakpoint
                </TypingAnimation>
              </button>
              
              {currentPage === 'home' && (
                <Button 
                  onClick={() => setCurrentPage('test')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Test Your Product
                </Button>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* Main Content */}
      {currentPage === 'home' ? (
        <HomePage onNavigateToTest={() => setCurrentPage('test')} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
          {/* Test Input Section */}
          <TestInterface onRunTest={handleRunTest} />

          {/* Results Table */}
          {testResults.length > 0 && (
            <>
              <ResultsTable results={testResults} />
              <ScoreFeedback score={overallScore} feedback={feedback} />
              <AnalysisSection results={testResults} score={overallScore || 0} />
            </>
          )}
        </main>
      )}
    </div>
  );
}
