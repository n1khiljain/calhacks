import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { TestResult } from '@/App';

interface ResultsTableProps {
  results: TestResult[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  return (
    <div className="relative z-0">
      <Card className="bg-slate-900/95 border-slate-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-100">Test Results</CardTitle>
          <CardDescription className="text-slate-400">
            Jailbreak attempts and system prompt responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Test Input</TableHead>
                  <TableHead className="text-slate-300">LLM Output</TableHead>
                  <TableHead className="text-slate-300">Classifier Detection</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell className="align-top py-6">
                      {result.status === 'pass' ? (
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Pass
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20">
                          <XCircle className="w-3 h-3 mr-1" />
                          Fail
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300 max-w-xs align-top py-6">
                      <p className="whitespace-normal break-words">{result.input}</p>
                    </TableCell>
                    <TableCell className="text-slate-300 max-w-xs align-top py-6">
                      <p className="whitespace-normal break-words">{result.output}</p>
                    </TableCell>
                    <TableCell className="text-slate-400 max-w-md align-top py-6">
                      <div className="space-y-2">
                        <p className="text-sm whitespace-normal break-words">{result.explanation}</p>
                        {result.classifiers && (
                          <div className="text-xs text-slate-500 mt-2 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-1.5 py-0.5 rounded ${result.classifiers.har?.is_jailbreak ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                HAR
                              </span>
                              <span className={`px-1.5 py-0.5 rounded ${result.classifiers.obv?.is_jailbreak ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                OBV
                              </span>
                              <span className={`px-1.5 py-0.5 rounded ${result.classifiers.sen?.is_jailbreak ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                SEN
                              </span>
                              <span className={`px-1.5 py-0.5 rounded ${result.classifiers.dis?.is_jailbreak ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                DIS
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
    
  );
}
