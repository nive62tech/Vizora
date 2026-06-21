import { useState, useEffect } from 'react'
import Home from './pages/Home'
import ModelSelector from './components/ModelSelector'
import { getCurrentModel, checkHealth } from './services/api'

export default function App() {
  const [setupComplete, setSetupComplete] = useState(null)
  const [backendOnline, setBackendOnline] = useState(null)

  useEffect(() => {
    const checkSetup = async () => {
      try {
        await checkHealth()
        setBackendOnline(true)
        const data = await getCurrentModel()
        setSetupComplete(data.setup_complete)
      } catch (err) {
        setBackendOnline(false)
        setSetupComplete(null)
      }
    }
    checkSetup()
  }, [])

  if (backendOnline === false) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f1117] px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-white text-xl font-bold mb-2">Backend is offline</h1>
          <p className="text-gray-400 text-sm mb-6">
            Vizora's backend is not running. Start it and then refresh this page.
          </p>
          <div className="bg-[#1a1d27] border border-gray-800 rounded-xl p-4 text-left mb-4">
            <p className="text-gray-400 text-xs font-medium mb-2">Run this in your terminal:</p>
            <code className="text-green-400 text-xs font-mono">
              cd phase-2-backend\app<br />
              uvicorn main:app --reload
            </code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (backendOnline === null || setupComplete === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f1117]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
            V
          </div>
          <p className="text-gray-400 text-sm">Starting Vizora...</p>
        </div>
      </div>
    )
  }

  if (!setupComplete) {
    return <ModelSelector onModelSelected={() => setSetupComplete(true)} />
  }

  return <Home />
}