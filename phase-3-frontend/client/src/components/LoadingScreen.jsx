import { useEffect, useState } from 'react'

const STEPS = [
  { label: 'Initializing Vizora', duration: 600 },
  { label: 'Connecting to backend', duration: 800 },
  { label: 'Loading AI engine', duration: 700 },
  { label: 'Ready', duration: 400 },
]

export default function LoadingScreen({ onDone }) {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    let total = 0
    const timers = []

    STEPS.forEach((s, i) => {
      timers.push(setTimeout(() => {
        setStep(i)
        setProgress(Math.round(((i + 1) / STEPS.length) * 100))
      }, total))
      total += s.duration
    })

    timers.push(setTimeout(() => {
      setLeaving(true)
      setTimeout(onDone, 600)
    }, total))

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 transition-all duration-700"
      style={{
        background: '#080B14',
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'scale(1.03)' : 'scale(1)',
      }}
    >
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
      }} />

      {/* Glow orb */}
      <div style={{
        position: 'absolute',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(6,182,212,0.04) 40%, transparent 70%)',
        borderRadius: '50%',
        animation: 'pulse-glow 3s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '80px', height: '80px',
            background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: '900',
            color: 'white',
            boxShadow: '0 0 60px rgba(59,130,246,0.5), 0 0 120px rgba(59,130,246,0.2)',
            animation: 'float 3s ease-in-out infinite',
          }}>V</div>

          {/* Ring */}
          <div style={{
            position: 'absolute',
            inset: '-12px',
            borderRadius: '36px',
            border: '1px solid rgba(59,130,246,0.2)',
            animation: 'spin 4s linear infinite',
          }} />
          <div style={{
            position: 'absolute',
            inset: '-24px',
            borderRadius: '44px',
            border: '1px solid rgba(6,182,212,0.1)',
            animation: 'spin 6s linear infinite reverse',
          }} />
        </div>

        <div className="text-center">
          <h1 style={{
            fontSize: '32px',
            fontWeight: '900',
            letterSpacing: '-1.5px',
            color: '#F1F5F9',
            marginBottom: '4px',
          }}>Vizora</h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>
            Local AI · Zero Cloud · Fully Private
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ width: '280px' }}>
          <div style={{
            height: '2px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '12px',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
              borderRadius: '999px',
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 10px rgba(59,130,246,0.8)',
            }} />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '6px', height: '6px',
                borderRadius: '50%',
                background: '#3B82F6',
                boxShadow: '0 0 8px #3B82F6',
                animation: 'blink 1s ease-in-out infinite',
              }} />
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                {STEPS[step]?.label}
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: '700' }}>
              {progress}%
            </span>
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? '20px' : '6px',
              height: '6px',
              borderRadius: '999px',
              background: i <= step ? '#3B82F6' : 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              boxShadow: i === step ? '0 0 10px rgba(59,130,246,0.8)' : 'none',
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}