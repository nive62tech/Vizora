import { useEffect, useRef, useState } from 'react'

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
        <span className="text-gray-300 text-xs truncate">{chart.title.replace(`Chart #${chart.chart_number} — `, '')}</span>
      </div>
      <div ref={ref} style={{ width: '100%', height: '250px' }} />
    </div>
  )
}


export default function DashboardView({ dashboard, onClose, onRename }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(dashboard.title)

  const handleRename = () => {
    if (title.trim()) {
      onRename(dashboard.id, title.trim())
      setEditing(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#0f1117]">

      {/* Dashboard Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-[#1a1d27] flex items-center gap-3">
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
              <button
                onClick={handleRename}
                className="text-blue-400 text-xs hover:text-blue-300"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="text-gray-500 text-xs hover:text-gray-400"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-white font-semibold">{dashboard.title}</h2>
              <button
                onClick={() => setEditing(true)}
                className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
                title="Rename dashboard"
              >
                ✏️
              </button>
            </div>
          )}
          <p className="text-gray-400 text-xs mt-0.5">
            {dashboard.charts.length} chart{dashboard.charts.length !== 1 ? 's' : ''} · Charts {dashboard.chart_numbers.join(', ')}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
        >
          ✕ Close
        </button>
      </div>

      {/* Dashboard Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid gap-4 ${dashboard.charts.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {dashboard.charts.map((chart) => (
            <DashboardChart key={chart.id} chart={chart} />
          ))}
        </div>
      </div>

    </div>
  )
}