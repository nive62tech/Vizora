import { useState, useEffect } from 'react'
import Home from './pages/Home'
import ModelSelector from './components/ModelSelector'
import LoadingScreen from './components/LoadingScreen'
import ParticleBackground from './components/ParticleBackground'
import { getCurrentModel, checkHealth } from './services/api'

export default function App() {
  const [appState, setAppState] = useState('loading') // loading | offline | setup | ready
  const [loadingDone, setLoadingDone] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)

  const checkBackend = async () => {
    try {
      await checkHealth()
      const data = await getCurrentModel()
      setSetupComplete(data.setup_complete)
      setAppState(data.setup_complete ? 'ready' : 'setup')
    } catch (err) {
      setAppState('offline')
    }
  }

  const handleLoadingDone = () => {
    setLoadingDone(true)
    checkBackend()
  }

  if (!loadingDone) {
    return (
      <>
        <ParticleBackground />
        <LoadingScreen onDone={handleLoadingDone} />
      </>
    )
  }

  if (appState === 'loading') {
    return (
      <>
        <ParticleBackground />
        <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#080B14', zIndex: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px', height: '48px',
              background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', fontWeight: '900', color: 'white',
              boxShadow: '0 0 30px rgba(59,130,246,0.5)',
              animation: 'float 2s ease-in-out infinite',
            }}>V</div>
            <p style={{ fontSize: '13px', color: '#64748B' }}>Connecting...</p>
          </div>
        </div>
        <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
      </>
    )
  }

  if (appState === 'offline') {
    return (
      <>
        <ParticleBackground />
        <div className="fixed inset-0 flex items-center justify-center px-6" style={{ background: '#080B14', zIndex: 10 }}>
          <div className="text-center" style={{ maxWidth: '400px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#F1F5F9', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              Backend offline
            </h1>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px', lineHeight: '1.6' }}>
              Start the backend server then refresh.
            </p>
            <div style={{
              background: 'rgba(13,17,23,0.9)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'left',
              marginBottom: '20px',
            }}>
              <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Run in terminal
              </p>
              <code style={{ fontSize: '12px', color: '#06B6D4', fontFamily: 'monospace', lineHeight: '1.8' }}>
                cd phase-2-backend\app<br />
                uvicorn main:app --reload
              </code>
            </div>
            <button
              onClick={() => { setAppState('loading'); setLoadingDone(false) }}
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 28px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(59,130,246,0.3)',
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </>
    )
  }

  if (appState === 'setup') {
    return (
      <>
        <ParticleBackground />
        <ModelSelector onModelSelected={() => setAppState('ready')} />
      </>
    )
  }

  return (
    <>
      <ParticleBackground />
      <Home />
    </>
  )
}