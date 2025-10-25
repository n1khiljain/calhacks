import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Play, Loader2, GraduationCap, Headphones, ShieldCheck, FileText } from 'lucide-react';

interface TestInterfaceProps {
  onRunTest: (systemPrompt: string) => void;
}

export function TestInterface({ onRunTest }: TestInterfaceProps) {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  
  const examples = [
    "You are a helpful tutor. Your role is to guide students to find answers themselves; not to provide direct answers",
    "You are a customer service assistant. Always maintain a professional tone and never share confidential company information"
  ];
  
  const examplePrompts = [
    {
      icon: GraduationCap,
      title: "Tutoring Assistant",
      prompt: "You are a helpful tutor. Your role is to guide students to find answers themselves, not to provide direct answers. If a student asks for a solution, offer hints and guide them through the problem-solving process."
    },
    {
      icon: Headphones,
      title: "Customer Support",
      prompt: "You are a customer service assistant. Always maintain a professional tone and never share confidential company information. Help customers resolve issues while following company policies."
    },
    {
      icon: ShieldCheck,
      title: "Content Moderator",
      prompt: "You are a content moderation assistant. Your role is to review and flag inappropriate content while respecting user privacy. Never provide advice on how to bypass content filters."
    },
    {
      icon: FileText,
      title: "Document Assistant",
      prompt: "You are a document processing assistant. Help users extract information from documents but never share sensitive personal information or confidential data with unauthorized parties."
    }
  ];
  
  useEffect(() => {
    if (systemPrompt) {
      return; // Stop animation if user has typed something
    }
    
    let currentIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;
    
    const animate = () => {
      const currentExample = examples[currentExampleIndex];
      
      if (!isDeleting) {
        // Typing
        if (currentIndex <= currentExample.length) {
          setDisplayText(currentExample.slice(0, currentIndex));
          currentIndex++;
          timeoutId = setTimeout(animate, 20);
        } else {
          // Finished typing, wait before deleting
          timeoutId = setTimeout(() => {
            isDeleting = true;
            animate();
          }, 2000);
        }
      } else {
        // Deleting
        if (currentIndex > 0) {
          currentIndex--;
          setDisplayText(currentExample.slice(0, currentIndex));
          timeoutId = setTimeout(animate, 10);
        } else {
          // Finished deleting, move to next example
          isDeleting = false;
          setCurrentExampleIndex((prev) => (prev + 1) % examples.length);
          timeoutId = setTimeout(animate, 500);
        }
      }
    };
    
    animate();
    
    return () => clearTimeout(timeoutId);
  }, [systemPrompt, currentExampleIndex]);

  const handleRunTest = async () => {
    if (!systemPrompt.trim()) return;
    
    setIsRunning(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    onRunTest(systemPrompt);
    setIsRunning(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h3 className="text-white/90 tracking-tight">Enter your LLM system prompt</h3>
      <div className="space-y-3 relative bg-white rounded-xl p-5 shadow-lg">
        <Textarea
          id="system-prompt"
          placeholder={displayText}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="min-h-[120px] bg-white border-0 text-slate-900 placeholder:text-slate-900 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none shadow-none tracking-tight"
          style={{ fontSize: '0.9375rem', lineHeight: '1.6', letterSpacing: '-0.01em' }}
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleRunTest} 
            disabled={!systemPrompt.trim() || isRunning}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Security Tests
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div>
        <p className="text-white/70 mb-3">Or try an example:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => setSystemPrompt(example.prompt)}
              className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/10 hover:border-white/30 group"
            >
              <example.icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <span className="text-white/90 text-sm text-center">{example.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
