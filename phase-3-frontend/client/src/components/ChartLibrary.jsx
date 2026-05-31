import { useEffect, useRef } from 'react'

function MiniChart({ chart }) {
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
          margin: { l: 20, r: 10, t: 10, b: 20 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(15,17,23,1)',
          font: { color: '#e2e8f0', size: 8 },
          xaxis: { gridcolor: '#2d3148', color: '#a0aec0', tickfont: { size: 7 } },
          yaxis: { gridcolor: '#2d3148', color: '#a0aec0', tickfont: { size: 7 } },
          showlegend: false,
          title: null,
        },
        { responsive: true, displayModeBar: false, staticPlot: true }
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

  return <div ref={ref} style={{ width: '100%', height: '80px' }} />
}


export default function ChartLibrary({ charts, onSelectChart, onDeleteChart, onRenameChart }) {
  if (!charts || charts.length === 0) {
    return (
      <div className="mt-2">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">
          Chart Library
        </p>
        <p className="text-gray-600 text-xs text-center py-4">
          No charts yet. Ask me to create a chart!
        </p>
      </div>
    )
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
        Chart Library ({charts.length})
      </p>

      {charts.map((chart) => (
        <div
          key={chart.id}
          className="bg-[#0f1117] rounded-lg border border-gray-800 overflow-hidden cursor-pointer hover:border-blue-500/50 transition-colors"
          onClick={() => onSelectChart(chart)}
        >
          <MiniChart chart={chart} />
          <div className="px-2 py-1.5 flex items-center gap-1.5">
            <span className="text-blue-400 text-xs font-bold">#{chart.chart_number}</span>
            <span className="text-gray-300 text-xs truncate flex-1">{chart.title.replace(`Chart #${chart.chart_number} — `, '')}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteChart(chart.id)
              }}
              className="text-gray-600 hover:text-red-400 text-xs transition-colors ml-1 shrink-0"
              title="Delete chart"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}