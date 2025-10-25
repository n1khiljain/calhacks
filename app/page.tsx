'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

//Ui components
import { toast } from "sonner"
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()
  const [systemPrompt, setSystemPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleHealthCheck = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health')
      const data = await response.json()
      console.log('Health check response:', data)
      toast.success(`Backend connection successful: ${data.message}`)
      } catch (error) {
        console.error('Health check failed:', error)
        toast.error(`Backend connection failed: ${error}`)
      }
  }

  const handleTest = async () => {
    if (!systemPrompt.trim()) {
      toast('Please enter a system prompt')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_prompt: systemPrompt
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Log results to console for terminal output
      console.log('=== JAILBREAK TEST RESULTS ===')
      console.log(`System Prompt: ${systemPrompt}`)
      console.log(`Total Vulnerabilities Found: ${data.vulnerabilities || 0}`)
      console.log('Detailed Results:', data.results)
      
      // Navigate to results page with data
      const resultsData = {
        ...data,
        system_prompt: systemPrompt
      }
      
      const encodedData = encodeURIComponent(JSON.stringify(resultsData))
      router.push(`/results?data=${encodedData}`)
      
    } catch (error) {
      console.error('Error testing security:', error)
      console.error('Full error details:', error)
      toast(`Error connecting to backend: ${error}. Make sure Flask server is running on port 5000.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Jailbreak AI Security Tester
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Enter Your AI System Prompt
          </h2>
          <p className="text-gray-600 mb-4">
            This tool will test your AI chatbot's security by attempting various jailbreak attacks.
          </p>
          
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Enter your AI system prompt here... (e.g., 'You are a helpful assistant that follows ethical guidelines.')"
            className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <div className="mt-4 flex gap-4">
             <Button 
               onClick={() => {
                 handleHealthCheck();
                 toast("Testing backend connection...");
               }}  
               className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Test Connection
             </Button>
            <Button
              onClick={handleTest}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isLoading ? 'Testing Security...' : 'Test Security'}
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500">
          <p>Click "Test Security" to analyze your AI system and view detailed results</p>
        </div>
      </div>
    </main>
  )
}
