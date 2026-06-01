import { useState, useEffect } from 'react'
import Home from './pages/Home'
import ModelSelector from './components/ModelSelector'
import { getCurrentModel } from './services/api'

export default function App() {
  const [setupComplete, setSetupComplete] = useState(null)

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const data = await getCurrentModel()
        setSetupComplete(data.setup_complete)
      } catch (err) {
        // Backend not running yet — skip setup screen
        setSetupComplete(true)
      }
    }
    checkSetup()
  }, [])

  if (setupComplete === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f1117]">
        <p className="text-gray-400 text-sm">Starting Vizora...</p>
      </div>
    )
  }

  if (!setupComplete) {
    return <ModelSelector onModelSelected={() => setSetupComplete(true)} />
  }

  return <Home />
}