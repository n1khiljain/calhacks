import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { TestResult } from '../App';

interface ResultsTableProps {
  results: TestResult[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 shadow-xl">
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
                <TableHead className="text-slate-300">Explanation</TableHead>
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
                    <p className="text-sm whitespace-normal break-words">{result.explanation}</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
