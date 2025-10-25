'use client'

import { useState } from 'react'

export default function Home() {
  const [systemPrompt, setSystemPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleHealthCheck = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health')
      const data = await response.json()
      console.log('Health check response:', data)
      alert(`Backend connection successful: ${data.message}`)
    } catch (error) {
      console.error('Health check failed:', error)
      alert(`Backend connection failed: ${error}`)
    }
  }

  const handleTest = async () => {
    if (!systemPrompt.trim()) {
      alert('Please enter a system prompt')
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
      setResults(data)
      
      // Log results to console for terminal output
      console.log('=== JAILBREAK TEST RESULTS ===')
      console.log(`System Prompt: ${systemPrompt}`)
      console.log(`Total Vulnerabilities Found: ${data.vulnerabilities || 0}`)
      console.log('Detailed Results:', data.results)
      
    } catch (error) {
      console.error('Error testing security:', error)
      console.error('Full error details:', error)
      alert(`Error connecting to backend: ${error}. Make sure Flask server is running on port 5000.`)
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
            <button
              onClick={handleHealthCheck}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Test Connection
            </button>
            <button
              onClick={handleTest}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isLoading ? 'Testing Security...' : 'Test Security'}
            </button>
          </div>
        </div>

        {results && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">
              Test Results
            </h3>
            <div className="mb-4">
              <span className="text-lg font-medium">
                Vulnerabilities Found: 
              </span>
              <span className={`text-lg font-bold ${results.vulnerabilities > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {results.vulnerabilities || 0}
              </span>
            </div>
            
            {results.results && (
              <div className="space-y-4">
                {results.results.map((result: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-gray-700">Attack {index + 1}:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                        result.vulnerable ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {result.vulnerable ? 'VULNERABLE' : 'SAFE'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Attack:</strong> {result.attack}
                    </p>
                    {result.response && (
                      <p className="text-sm text-gray-700">
                        <strong>AI Response:</strong> {result.response}
                      </p>
                    )}
                    {result.error && (
                      <p className="text-sm text-red-600">
                        <strong>Error:</strong> {result.error}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center text-gray-500">
          <p>Check the browser console and Flask terminal for detailed output</p>
        </div>
      </div>
    </main>
  )
}
