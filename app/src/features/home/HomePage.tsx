import * as React from "react";
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { TypingAnimation } from '@/components/ui/typing-animation';

interface HomePageProps {
  onNavigateToTest: () => void;
}

export function HomePage({ onNavigateToTest }: HomePageProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-10 pb-12 overflow-hidden relative z-0">
      {/* Background grid */}
      
      {/* Foreground content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Animated Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <TypingAnimation 
            className="text-slate-100 text-3xl md:text-4xl max-w-3xl mx-auto leading-tight" 
            style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", letterSpacing: '-0.01em', fontWeight: 700 }} 
            words={[
              "Protect your LLM applications from jailbreak attacks and prompt injection vulnerabilities", 
              "Test your system prompts against sophisticated jailbreak techniques and strengthen your AI"
            ]}
            typeSpeed={30}
            deleteSpeed={20}
            pauseDelay={3000}
            showCursor={false}
            loop
          />
        </motion.div>
  
        {/* Animated CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button 
            onClick={onNavigateToTest}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg group"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
  
        {/* Animated Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-6 space-y-3 hover:bg-slate-900/95 hover:border-slate-700 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-bold">Instant Testing</h3>
            <p className="text-white text-sm">
              Run comprehensive jailbreak tests on your prompts in seconds
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-6 space-y-3 hover:bg-slate-900/95 hover:border-slate-700 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-white font-bold">Detailed Analysis</h3>
            <p className="text-white text-sm">
              Get clear explanations of vulnerabilities and how to fix them
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-6 space-y-3 hover:bg-slate-900/95 hover:border-slate-700 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white font-bold">Security Score</h3>
            <p className="text-white text-sm">
              Receive an overall security rating and actionable recommendations
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}  
