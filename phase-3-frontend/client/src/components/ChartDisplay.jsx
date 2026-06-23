import { useEffect, useRef } from 'react'
import ExportButtons from './ExportButtons'
import { exportChartAsPNG, exportChartAsHTML } from '../services/exportUtils'

export default function ChartDisplay({ chart }) {
  const chartRef = useRef(null)

  useEffect(() => {
    if (!chart || !chartRef.current) return

    import('plotly.js/dist/plotly.min.js').then((Plotly) => {
      Plotly.default.newPlot(
        chartRef.current,
        chart.plotly_json.data,
        {
          ...chart.plotly_json.layout,
          autosize: true,
          margin: { l: 40, r: 20, t: 40, b: 40 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(8,11,20,0.6)',
          font: { color: '#94A3B8', size: 11 },
          xaxis: { gridcolor: 'rgba(255,255,255,0.05)', color: '#64748B', zerolinecolor: 'rgba(255,255,255,0.05)' },
          yaxis: { gridcolor: 'rgba(255,255,255,0.05)', color: '#64748B', zerolinecolor: 'rgba(255,255,255,0.05)' },
        },
        { responsive: true, displayModeBar: false }
      )
    })

    return () => {
      if (chartRef.current) {
        import('plotly.js/dist/plotly.min.js').then((Plotly) => {
          Plotly.default.purge(chartRef.current)
        })
      }
    }
  }, [chart])

  if (!chart) return null

  return (
    <div className="w-full rounded-2xl border overflow-hidden animate-fade-up"
      style={{
        background: 'rgba(13,17,23,0.9)',
        borderColor: 'rgba(59,130,246,0.15)',
        boxShadow: '0 0 40px rgba(59,130,246,0.05)',
      }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(59,130,246,0.15)', color: '#93C5FD' }}>
          #{chart.chart_number}
        </span>
        <span className="text-xs font-medium flex-1 truncate" style={{ color: '#94A3B8' }}>{chart.title}</span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: '#64748B' }}>
          {chart.chart_type}
        </span>
        <ExportButtons
          onExportPNG={async () => chartRef.current && await exportChartAsPNG(chartRef.current, chart.title)}
          onExportHTML={() => exportChartAsHTML(chart, chart.title)}
          onExportPDF={() => window.print()}
          size="small"
        />
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '320px' }} />
    </div>
  )
}