import FileDropZone from './FileDropZone'
import ChartLibrary from './ChartLibrary'

export default function Sidebar({
  fileInfo, onFileUploaded,
  charts, onSelectChart, onDeleteChart, onRenameChart,
  dashboards, onSelectDashboard, onDeleteDashboard
}) {
  return (
    <div className="w-72 h-screen bg-[#1a1d27] border-r border-gray-800 flex flex-col p-4 gap-4 shrink-0 overflow-y-auto">

      {/* Logo */}
      <div className="flex items-center gap-2 pb-3 border-b border-gray-800">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          V
        </div>
        <span className="text-white font-semibold text-lg">Vizora</span>
      </div>

      {/* File Drop */}
      <div>
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">
          Data Source
        </p>
        <FileDropZone onFileUploaded={onFileUploaded} />
      </div>

      {/* File Info */}
      {fileInfo && (
        <div className="flex flex-col gap-2">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
            File Info
          </p>
          <div className="bg-[#0f1117] rounded-lg p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xs">✓</span>
              <span className="text-gray-200 text-sm font-medium truncate">{fileInfo.filename}</span>
            </div>
            <div className="flex gap-3 text-xs text-gray-400">
              <span>{fileInfo.rows} rows</span>
              <span>•</span>
              <span>{fileInfo.columns} columns</span>
            </div>
            <div className="mt-1">
              <p className="text-gray-500 text-xs mb-1">Columns:</p>
              <div className="flex flex-wrap gap-1">
                {fileInfo.column_names.map((col) => (
                  <span key={col} className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                    {col}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboards */}
      {dashboards && dashboards.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
            Dashboards ({dashboards.length})
          </p>
          {dashboards.map((d) => (
            <div
              key={d.id}
              className="bg-[#0f1117] rounded-lg border border-gray-800 px-3 py-2 flex items-center gap-2 cursor-pointer hover:border-blue-500/50 transition-colors"
              onClick={() => onSelectDashboard(d)}
            >
              <span className="text-lg">📊</span>
              <div className="flex-1 min-w-0">
                <p className="text-gray-200 text-xs font-medium truncate">{d.title}</p>
                <p className="text-gray-500 text-xs">{d.charts.length} charts</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteDashboard(d.id) }}
                className="text-gray-600 hover:text-red-400 text-xs transition-colors shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Chart Library */}
      <ChartLibrary
        charts={charts}
        onSelectChart={onSelectChart}
        onDeleteChart={onDeleteChart}
        onRenameChart={onRenameChart}
      />

      {/* Bottom */}
      <div className="mt-auto pt-3 border-t border-gray-800 flex flex-col gap-2">
        <button
          onClick={async () => {
            const { resetModelSelection } = await import('../services/api')
            await resetModelSelection()
            window.location.reload()
          }}
          className="text-gray-600 hover:text-gray-400 text-xs text-center transition-colors"
        >
          ⚙️ Change AI model
        </button>
        <p className="text-gray-600 text-xs text-center">
          Fully local • No cloud • Private
        </p>
      </div>

    </div>
  )
}