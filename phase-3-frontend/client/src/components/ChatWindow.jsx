import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import ChartDisplay from './ChartDisplay'

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

      {/* Header — only when chatting */}
      {hasMessages && (
        <div className="shrink-0 px-6 py-3 border-b flex items-center gap-3 animate-fade-in"
          style={{ background: 'rgba(13,17,23,0.8)', borderColor: 'var(--border)', backdropFilter: 'blur(20px)' }}>
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

      {/* Selected chart from sidebar */}
      {selectedChart && (
        <div className="px-6 pt-4 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
              Viewing from library
            </p>
            <button onClick={onClearSelectedChart} className="text-xs transition-colors hover:opacity-100 opacity-50" style={{ color: 'var(--text)' }}>
              ✕ Close
            </button>
          </div>
          <ChartDisplay chart={selectedChart} />
        </div>
      )}

      {/* CENTER SEARCH — shown before first message */}
      {!hasMessages && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 animate-fade-up">
          <div className="glow-orb" style={{ position: 'absolute' }} />

          <div className="relative z-10 w-full max-w-xl text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-6 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', boxShadow: '0 0 40px rgba(59,130,246,0.4)' }}>
              V
            </div>

            <h1 className="text-3xl font-black mb-2 tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-1px' }}>
              {fileInfo ? `Analyzing ${fileInfo.filename}` : 'What do you want to know?'}
            </h1>
            <p className="text-sm mb-8" style={{ color: 'var(--muted2)' }}>
              {fileInfo
                ? `${fileInfo.rows} rows · ${fileInfo.columns} columns — ask me anything`
                : 'Upload a data file in the sidebar to get started'}
            </p>

            {/* Center search bar */}
            <div className="relative mb-6">
              <div className="flex items-center rounded-2xl border px-4 py-3 gap-3 transition-all"
                style={{
                  background: 'rgba(13,17,23,0.9)',
                  borderColor: 'rgba(59,130,246,0.3)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 0 40px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}>
                <span style={{ color: 'var(--muted)' }}>💬</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={fileInfo ? 'Ask something about your data...' : 'Upload a file first...'}
                  disabled={!fileInfo}
                  autoFocus
                  className="flex-1 bg-transparent text-sm focus:outline-none disabled:opacity-40"
                  style={{ color: 'var(--text)' }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || !fileInfo || loading}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold transition-all disabled:opacity-30"
                  style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}
                >
                  ↑
                </button>
              </div>
            </div>

            {/* Hint chips */}
            {fileInfo && (
              <div className="flex flex-wrap gap-2 justify-center">
                {HINTS.map((hint) => (
                  <button
                    key={hint.text}
                    onClick={() => handleSend(hint.text)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border)',
                      color: 'var(--muted2)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <span>{hint.icon}</span>
                    {hint.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MESSAGES — shown after first message */}
      {hasMessages && (
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div key={msg.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.03}s` }}>
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

      {/* BOTTOM INPUT — shown after first message */}
      {hasMessages && (
        <div className="shrink-0 px-6 py-4 border-t animate-fade-in"
          style={{ background: 'rgba(13,17,23,0.9)', borderColor: 'var(--border)', backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center gap-3 rounded-2xl border px-4 py-2.5 transition-all"
            style={{
              background: 'rgba(8,11,20,0.8)',
              borderColor: 'rgba(59,130,246,0.2)',
            }}
            onFocus={() => {}}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={fileInfo ? 'Ask something about your data...' : 'Upload a file first...'}
              disabled={!fileInfo}
              rows={1}
              className="flex-1 bg-transparent text-sm resize-none focus:outline-none disabled:opacity-40"
              style={{ color: 'var(--text)', lineHeight: '1.5' }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || !fileInfo || loading}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold transition-all disabled:opacity-30 shrink-0 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}
            >
              ↑
            </button>
          </div>
        </div>
      )}

    </div>
  )
}