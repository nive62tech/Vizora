import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import ChartDisplay from './ChartDisplay'
import QuickFilters from './QuickFilters'

const HINTS = [
  { icon: '📊', text: 'Show me a bar chart' },
  { icon: '🥧', text: 'Create a pie chart' },
  { icon: '📋', text: 'Summarize this data' },
  { icon: '📈', text: 'Show salary by city' },
]

export default function ChatWindow({ messages, loading, onSendMessage, fileInfo, selectedChart, onClearSelectedChart }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const hasMessages = messages.length > 1

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = (text) => {
    const msg = text || input
    if (!msg.trim() || loading) return
    onSendMessage(msg, fileInfo)
    setInput('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col flex-1 h-full relative" style={{ background: 'var(--bg)', zIndex: 1 }}>

      {/* Header */}
      {hasMessages && (
        <div className="shrink-0 px-6 py-3 border-b flex items-center gap-3 animate-fade-in"
          style={{ background: 'rgba(13,17,23,0.85)', borderColor: 'var(--border)', backdropFilter: 'blur(20px)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}>V</div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
              {fileInfo ? fileInfo.filename : 'Vizora'}
            </h1>
            {fileInfo && (
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {fileInfo.rows} rows · {fileInfo.columns} columns
              </p>
            )}
          </div>
        </div>
      )}

      {/* Quick filters */}
      {hasMessages && (
        <QuickFilters fileInfo={fileInfo} onSelect={(prompt) => handleSend(prompt)} />
      )}

      {/* Selected chart */}
      {selectedChart && (
        <div className="px-6 pt-4 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
              Viewing from library
            </p>
            <button onClick={onClearSelectedChart} className="text-xs opacity-50 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>
              ✕ Close
            </button>
          </div>
          <ChartDisplay chart={selectedChart} />
        </div>
      )}

      {/* Center search — before first message */}
      {!hasMessages && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 animate-fade-up">
          <div style={{
            position: 'absolute',
            width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            animation: 'pulse-glow 4s ease-in-out infinite',
          }} />

          <div className="relative z-10 w-full max-w-xl text-center">
            <div style={{
              width: '56px', height: '56px',
              background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
              borderRadius: '18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: '900', color: 'white',
              margin: '0 auto 20px',
              boxShadow: '0 0 40px rgba(59,130,246,0.4)',
              animation: 'float 3s ease-in-out infinite',
            }}>V</div>

            <h1 style={{
              fontSize: '28px', fontWeight: '900',
              letterSpacing: '-1px', color: 'var(--text)',
              marginBottom: '8px',
            }}>
              {fileInfo ? `Analyzing ${fileInfo.filename}` : 'What do you want to know?'}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--muted2)', marginBottom: '28px' }}>
              {fileInfo
                ? `${fileInfo.rows} rows · ${fileInfo.columns} columns — ask me anything`
                : 'Upload a data file in the sidebar to get started'}
            </p>

            {/* Center search bar */}
            <div style={{
              display: 'flex', alignItems: 'center',
              borderRadius: '18px',
              border: '1px solid rgba(59,130,246,0.3)',
              background: 'rgba(13,17,23,0.9)',
              backdropFilter: 'blur(20px)',
              padding: '12px 16px',
              gap: '12px',
              marginBottom: '20px',
              boxShadow: '0 0 40px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}>
              <span style={{ color: 'var(--muted)', fontSize: '16px' }}>💬</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={fileInfo ? 'Ask something about your data...' : 'Upload a file first...'}
                disabled={!fileInfo}
                autoFocus
                style={{
                  flex: 1, background: 'transparent',
                  border: 'none', outline: 'none',
                  fontSize: '14px', color: 'var(--text)',
                  opacity: fileInfo ? 1 : 0.4,
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || !fileInfo || loading}
                style={{
                  width: '36px', height: '36px',
                  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                  border: 'none', borderRadius: '10px',
                  color: 'white', fontSize: '16px', fontWeight: '700',
                  cursor: 'pointer', opacity: (!input.trim() || !fileInfo) ? 0.3 : 1,
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >↑</button>
            </div>

            {/* Hint chips */}
            {fileInfo && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {HINTS.map((hint) => (
                  <button
                    key={hint.text}
                    onClick={() => handleSend(hint.text)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border)',
                      color: 'var(--muted2)', fontSize: '12px', fontWeight: '500',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'
                      e.currentTarget.style.background = 'rgba(59,130,246,0.08)'
                      e.currentTarget.style.color = '#93C5FD'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                      e.currentTarget.style.color = 'var(--muted2)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <span>{hint.icon}</span>{hint.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      {hasMessages && (
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div key={msg.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}>
              <MessageBubble message={msg} />
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="rounded-2xl rounded-bl-sm px-4 py-3 border"
                style={{ background: 'rgba(13,17,23,0.9)', borderColor: 'var(--border)' }}>
                <div className="flex gap-1 items-center">
                  {[0, 150, 300].map(delay => (
                    <span key={delay} className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: 'var(--muted)', animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Bottom input */}
      {hasMessages && (
        <div className="shrink-0 px-6 py-4 border-t"
          style={{ background: 'rgba(13,17,23,0.9)', borderColor: 'var(--border)', backdropFilter: 'blur(20px)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            borderRadius: '16px',
            border: '1px solid rgba(59,130,246,0.2)',
            background: 'rgba(8,11,20,0.8)',
            padding: '10px 16px',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={fileInfo ? 'Ask something about your data...' : 'Upload a file first...'}
              disabled={!fileInfo}
              rows={1}
              style={{
                flex: 1, background: 'transparent',
                border: 'none', outline: 'none',
                fontSize: '14px', color: 'var(--text)',
                resize: 'none', lineHeight: '1.5',
                opacity: fileInfo ? 1 : 0.4,
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || !fileInfo || loading}
              style={{
                width: '34px', height: '34px',
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                border: 'none', borderRadius: '10px',
                color: 'white', fontSize: '14px', fontWeight: '700',
                cursor: 'pointer', opacity: (!input.trim() || !fileInfo || loading) ? 0.3 : 1,
                transition: 'all 0.2s', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.transform = 'scale(1.1)' }}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >↑</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}