import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, XCircle, TrendingUp, Shield, Target, Lightbulb } from 'lucide-react';

interface TestResult {
  id: string;
  input: string;
  output: string;
  status: 'pass' | 'fail';
  explanation: string;
  classifiers?: any;
  timestamp: Date;
}

interface AnalysisSectionProps {
  results: TestResult[];
  score: number;
}

export function AnalysisSection({ results, score }: AnalysisSectionProps) {
  // Analyze the test results to generate insights
  const analyzeResults = () => {
    const totalTests = results.length;
    const failedTests = results.filter(r => r.status === 'fail').length;
    const successRate = ((totalTests - failedTests) / totalTests) * 100;
    
    // Analyze attack patterns
    const attackPatterns = new Map<string, { total: number; failed: number; examples: string[] }>();
    
    results.forEach(result => {
      // Extract attack type from input (simplified classification)
      let attackType = 'unknown';
      const input = result.input.toLowerCase();
      
      if (input.includes('creative') || input.includes('framing')) {
        attackType = 'creative_bypass';
      } else if (input.includes('academic') || input.includes('journalistic')) {
        attackType = 'credibility_context';
      } else if (input.includes('fictional') || input.includes('story')) {
        attackType = 'fictional_context';
      } else if (input.includes('dan') || input.includes('jailbreak')) {
        attackType = 'direct_jailbreak';
      } else if (input.includes('roleplay') || input.includes('pretend')) {
        attackType = 'roleplay';
      } else if (input.includes('sensitive') || input.includes('confidential')) {
        attackType = 'sensitive_extraction';
      }
      
      if (!attackPatterns.has(attackType)) {
        attackPatterns.set(attackType, { total: 0, failed: 0, examples: [] });
      }
      
      const pattern = attackPatterns.get(attackType)!;
      pattern.total++;
      if (result.status === 'fail') {
        pattern.failed++;
        if (pattern.examples.length < 2) {
          pattern.examples.push(result.input.substring(0, 100) + '...');
        }
      }
    });
    
    // Generate vulnerability insights
    const vulnerabilities = [];
    const recommendations = [];
    
    // Overall security assessment
    if (successRate < 50) {
      vulnerabilities.push('🚨 CRITICAL: High vulnerability rate detected');
      recommendations.push('Immediate system prompt revision required');
    } else if (successRate < 75) {
      vulnerabilities.push('⚠️ MODERATE: Some vulnerabilities detected');
      recommendations.push('Strengthen security boundaries in system prompt');
    } else {
      vulnerabilities.push('✅ GOOD: Low vulnerability rate');
      recommendations.push('Minor improvements recommended');
    }
    
    // Pattern-specific analysis
    attackPatterns.forEach((pattern, attackType) => {
      const failureRate = (pattern.failed / pattern.total) * 100;
      
      if (failureRate > 50) {
        const attackName = attackType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        vulnerabilities.push(`🔍 ${attackName}: ${pattern.failed}/${pattern.total} attacks succeeded`);
        
        // Generate specific recommendations
        switch (attackType) {
          case 'creative_bypass':
            recommendations.push('Add explicit instructions to refuse creative framing attempts');
            break;
          case 'credibility_context':
            recommendations.push('Implement stronger verification for academic/journalistic contexts');
            break;
          case 'fictional_context':
            recommendations.push('Add boundaries between fictional and real-world scenarios');
            break;
          case 'direct_jailbreak':
            recommendations.push('Strengthen jailbreak detection and refusal mechanisms');
            break;
          case 'roleplay':
            recommendations.push('Add explicit roleplay refusal instructions');
            break;
          case 'sensitive_extraction':
            recommendations.push('Implement data classification and confidentiality checks');
            break;
        }
      }
    });
    
    // General recommendations
    recommendations.push('📝 Review and strengthen system prompt with explicit security boundaries');
    recommendations.push('🛡️ Add refusal mechanisms for sensitive or harmful requests');
    recommendations.push('⚡ Test regularly with diverse attack patterns');
    
    return {
      vulnerabilities: vulnerabilities.slice(0, 5), // Top 5 vulnerabilities
      recommendations: recommendations.slice(0, 6), // Top 6 recommendations
      attackPatterns: Array.from(attackPatterns.entries()).map(([type, data]) => ({
        type: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        successRate: ((data.total - data.failed) / data.total) * 100,
        failureRate: (data.failed / data.total) * 100,
        examples: data.examples
      }))
    };
  };
  
  const analysis = analyzeResults();
  
  if (results.length === 0) return null;
  
  return (
    <Card className="bg-slate-900/50 border-slate-800 shadow-xl">
      <CardHeader>
        <CardTitle className="text-slate-100 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          Summary
        </CardTitle>
        <CardDescription className="text-slate-400">
          Vulnerability analysis and improvement suggestions based on test results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-slate-200 text-sm font-medium">Overall Security</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">{score}%</div>
            <div className="text-xs text-slate-400">
              {score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Attention'}
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-slate-200 text-sm font-medium">Tests Passed</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {results.filter(r => r.status === 'pass').length}
            </div>
            <div className="text-xs text-slate-400">out of {results.length} tests</div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-slate-200 text-sm font-medium">Vulnerabilities</span>
            </div>
            <div className="text-2xl font-bold text-red-400">
              {results.filter(r => r.status === 'fail').length}
            </div>
            <div className="text-xs text-slate-400">detected</div>
          </div>
        </div>
        
        {/* Attack Pattern Analysis */}
        {analysis.attackPatterns.length > 0 && (
          <div>
            <h4 className="text-slate-200 font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Attack Pattern Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.attackPatterns.map((pattern, index) => (
                <div key={index} className="bg-slate-800/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-200 text-sm font-medium">{pattern.type}</span>
                    <Badge 
                      className={
                        pattern.successRate >= 75 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        pattern.successRate >= 50 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }
                    >
                      {pattern.successRate.toFixed(0)}% success
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-400">
                    {pattern.failureRate.toFixed(0)}% failure rate
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Vulnerabilities Detected */}
        {analysis.vulnerabilities.length > 0 && (
          <div>
            <h4 className="text-slate-200 font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Key Vulnerabilities
            </h4>
            <div className="space-y-2">
              {analysis.vulnerabilities.map((vuln, index) => (
                <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <div className="text-slate-200 text-sm">{vuln}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <div>
            <h4 className="text-slate-200 font-medium mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              Recommendations for Improvement
            </h4>
            <div className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <div className="text-slate-200 text-sm">{rec}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
