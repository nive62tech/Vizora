import { useState, useEffect } from 'react'
import { getAvailableModels, selectModel, checkOllama } from '../services/api'

export default function ModelSelector({ onModelSelected }) {
  const [models, setModels] = useState({})
  const [selectedKey, setSelectedKey] = useState('tinyllama')
  const [ollamaStatus, setOllamaStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const [modelsData, ollamaData] = await Promise.all([
          getAvailableModels(),
          checkOllama(),
        ])
        setModels(modelsData)
        setOllamaStatus(ollamaData)
      } catch (err) {
        console.error('Failed to load models', err)
      } finally {
        setChecking(false)
      }
    }
    init()
  }, [])

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await selectModel(selectedKey)
      onModelSelected(selectedKey)
    } catch (err) {
      console.error('Failed to select model', err)
    } finally {
      setLoading(false)
    }
  }

  const modelColors = {
    tinyllama: 'border-green-500/50 bg-green-500/5',
    phi3: 'border-blue-500/50 bg-blue-500/5',
    mistral: 'border-purple-500/50 bg-purple-500/5',
  }

  const modelAccents = {
    tinyllama: 'text-green-400',
    phi3: 'text-blue-400',
    mistral: 'text-purple-400',
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f1117]">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#0f1117] px-6">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            V
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Welcome to Vizora</h1>
          <p className="text-gray-400 text-sm">
            Choose your AI model. This runs fully locally on your machine — no internet needed.
          </p>
        </div>

        {/* Ollama status */}
        <div className={`rounded-lg px-4 py-2.5 mb-6 flex items-center gap-2 text-xs ${
          ollamaStatus?.running
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          <span>{ollamaStatus?.running ? '✓' : '✗'}</span>
          <span>
            {ollamaStatus?.running
              ? `Ollama is running · Installed models: ${ollamaStatus.installed_models.length > 0 ? ollamaStatus.installed_models.join(', ') : 'none yet'}`
              : 'Ollama is not running. Start it before continuing.'
            }
          </span>
        </div>

        {/* Model cards */}
        <div className="flex flex-col gap-3 mb-6">
          {Object.entries(models).map(([key, model]) => {
            const isInstalled = ollamaStatus?.installed_models?.includes(key)
            const isSelected = selectedKey === key

            return (
              <div
                key={key}
                onClick={() => setSelectedKey(key)}
                className={`
                  border rounded-xl p-4 cursor-pointer transition-all duration-150
                  ${isSelected
                    ? modelColors[key] || 'border-blue-500/50 bg-blue-500/5'
                    : 'border-gray-800 hover:border-gray-600'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                    isSelected ? 'border-blue-400' : 'border-gray-600'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm font-medium">{model.name}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        modelAccents[key] || 'text-blue-400'
                      } bg-current/10`} style={{ backgroundColor: 'rgba(59,130,246,0.1)' }}>
                        {model.size}
                      </span>
                      {isInstalled && (
                        <span className="text-green-400 text-xs">✓ installed</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs">{model.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={loading || !ollamaStatus?.running}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-medium transition-colors"
        >
          {loading ? 'Saving...' : `Use ${models[selectedKey]?.name || selectedKey}`}
        </button>

        <p className="text-gray-600 text-xs text-center mt-4">
          You can change your model later from settings · Fully local · No cloud · No accounts
        </p>

      </div>
    </div>
  )
}