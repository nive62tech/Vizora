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
          plot_bgcolor: 'rgba(26,29,39,1)',
          font: { color: '#e2e8f0' },
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

  const handleExportPNG = async () => {
    if (chartRef.current) {
      await exportChartAsPNG(chartRef.current, chart.title)
    }
  }

  const handleExportHTML = () => {
    exportChartAsHTML(chart, chart.title)
  }

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <div className="w-full bg-[#1a1d27] rounded-xl border border-gray-800 p-4 mt-2">
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2 py-1 rounded-full">
          #{chart.chart_number}
        </span>
        <span className="text-gray-300 text-sm font-medium flex-1">{chart.title}</span>
        <ExportButtons
          onExportPNG={handleExportPNG}
          onExportHTML={handleExportHTML}
          onExportPDF={handleExportPDF}
          size="small"
        />
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '350px' }} />
    </div>
  )
}