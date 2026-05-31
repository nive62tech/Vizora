import { useEffect, useRef, useState } from 'react'
import { liveEditDashboard } from '../services/api'

function DashboardChart({ chart }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!chart || !ref.current) return

    import('plotly.js/dist/plotly.min.js').then((Plotly) => {
      Plotly.default.newPlot(
        ref.current,
        chart.plotly_json.data,
        {
          ...chart.plotly_json.layout,
          autosize: true,
          margin: { l: 40, r: 20, t: 40, b: 40 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(15,17,23,1)',
          font: { color: '#e2e8f0' },
          xaxis: { gridcolor: '#2d3148', color: '#a0aec0' },
          yaxis: { gridcolor: '#2d3148', color: '#a0aec0' },
        },
        { responsive: true, displayModeBar: false }
      )
    })

    return () => {
      if (ref.current) {
        import('plotly.js/dist/plotly.min.js').then((Plotly) => {
          Plotly.default.purge(ref.current)
        })
      }
    }
  }, [chart])

  return (
    <div className="bg-[#1a1d27] rounded-xl border border-gray-800 p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full">
          #{chart.chart_number}
        </span>
        <span className="text-gray-300 text-xs truncate">
          {chart.title.replace(`Chart #${chart.chart_number} — `, '')}
        </span>
      </div>
      <div ref={ref} style={{ width: '100%', height: '250px' }} />
    </div>
  )
}


export default function DashboardView({ dashboard: initialDashboard, onClose, onRename }) {
  const [dashboard, setDashboard] = useState(initialDashboard)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(initialDashboard.title)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Dashboard is live! You can edit it by chatting here. Try: "add chart 3", "remove chart 1", "make chart 2 a line chart", or "rename this dashboard to Sales Report".' }
  ])
  const [chatLoading, setChatLoading] = useState(false)
  const chatBottomRef = useRef(null)

  useEffect(() => {
    setDashboard(initialDashboard)
    setTitle(initialDashboard.title)
  }, [initialDashboard])

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleRename = () => {
    if (title.trim()) {
      onRename(dashboard.id, title.trim())
      setDashboard(prev => ({ ...prev, title: title.trim() }))
      setEditing(false)
    }
  }

  const handleLiveEdit = async () => {
    if (!chatInput.trim() || chatLoading) return

    const userMsg = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setChatLoading(true)

    try {
      const result = await liveEditDashboard(userMsg, dashboard.id)
      setDashboard(result.dashboard)
      setTitle(result.dashboard.title)
      setChatMessages(prev => [...prev, { role: 'assistant', content: result.message }])
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Edit failed. Try again.'
      setChatMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMsg}` }])
    } finally {
      setChatLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleLiveEdit()
    }
  }

  return (
    <div className="flex flex-col h-screen flex-1 bg-[#0f1117]">

      {/* Dashboard Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-[#1a1d27] flex items-center gap-3 shrink-0">
        <div className="flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                className="bg-[#0f1117] border border-blue-500 rounded-lg px-3 py-1 text-white text-sm focus:outline-none"
                autoFocus
              />
              <button onClick={handleRename} className="text-blue-400 text-xs hover:text-blue-300">Save</button>
              <button onClick={() => setEditing(false)} className="text-gray-500 text-xs hover:text-gray-400">Cancel</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-white font-semibold">{dashboard.title}</h2>
              <button onClick={() => setEditing(true)} className="text-gray-600 hover:text-gray-400 text-xs" title="Rename">✏️</button>
            </div>
          )}
          <p className="text-gray-400 text-xs mt-0.5">
            {dashboard.charts.length} chart{dashboard.charts.length !== 1 ? 's' : ''} · Charts {dashboard.chart_numbers.join(', ')}
          </p>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-400 text-sm transition-colors">
          ✕ Close
        </button>
      </div>

      {/* Main area — charts + live chat side by side */}
      <div className="flex flex-1 overflow-hidden">

        {/* Charts grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {dashboard.charts.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">No charts in this dashboard. Add one using the chat!</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${dashboard.charts.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {dashboard.charts.map((chart) => (
                <DashboardChart key={chart.id + chart.chart_type} chart={chart} />
              ))}
            </div>
          )}
        </div>

        {/* Live edit chat panel */}
        <div className="w-72 border-l border-gray-800 bg-[#1a1d27] flex flex-col shrink-0">

          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-gray-300 text-xs font-medium uppercase tracking-wider">Live Edit</p>
            <p className="text-gray-500 text-xs mt-0.5">Chat to edit this dashboard</p>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#0f1117] text-gray-300 border border-gray-800'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-[#0f1117] border border-gray-800 rounded-xl px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          <div className="px-3 py-3 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Edit dashboard..."
                disabled={chatLoading}
                className="flex-1 bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500 disabled:opacity-40"
              />
              <button
                onClick={handleLiveEdit}
                disabled={!chatInput.trim() || chatLoading}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg px-3 py-2 text-xs font-medium transition-colors"
              >
                ↑
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}