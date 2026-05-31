import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import ChartDisplay from './ChartDisplay'

export default function ChatWindow({ messages, loading, onSendMessage, fileInfo, selectedChart, onClearSelectedChart }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || loading) return
    onSendMessage(input, fileInfo)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen flex-1 bg-[#0f1117]">

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-[#1a1d27]">
        <h1 className="text-white font-semibold">
          {fileInfo ? `Analyzing: ${fileInfo.filename}` : 'Vizora — Chat with your data'}
        </h1>
        {fileInfo && (
          <p className="text-gray-400 text-xs mt-0.5">
            {fileInfo.rows} rows · {fileInfo.columns} columns
          </p>
        )}
      </div>

      {/* Selected chart from sidebar */}
      {selectedChart && (
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Viewing from library
            </p>
            <button
              onClick={onClearSelectedChart}
              className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
            >
              ✕ Close
            </button>
          </div>
          <ChartDisplay chart={selectedChart} />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1d27] border border-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-800 bg-[#1a1d27]">
        {!fileInfo && (
          <p className="text-yellow-500/70 text-xs mb-2 text-center">
            Upload a file in the sidebar to start analyzing your data
          </p>
        )}
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={fileInfo ? 'Ask something about your data...' : 'Upload a file first...'}
            disabled={!fileInfo || loading}
            rows={1}
            className="flex-1 bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !fileInfo || loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 text-sm font-medium transition-colors shrink-0"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  )
}