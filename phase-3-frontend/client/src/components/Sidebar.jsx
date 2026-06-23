import FileDropZone from './FileDropZone'
import ChartLibrary from './ChartLibrary'

export default function Sidebar({
  fileInfo, onFileUploaded,
  charts, onSelectChart, onDeleteChart, onRenameChart,
  dashboards, onSelectDashboard, onDeleteDashboard
}) {
  return (
    <div className="shrink-0 flex flex-col h-full overflow-y-auto"
      style={{
        width: '260px',
        background: 'rgba(13,17,23,0.95)',
        borderRight: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        zIndex: 10,
      }}>

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', boxShadow: '0 0 16px rgba(59,130,246,0.4)' }}>
          V
        </div>
        <span className="font-bold text-base" style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}>Vizora</span>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E', boxShadow: '0 0 6px #22C55E' }}></div>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>local</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 flex-1">

        {/* Data Source */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)', letterSpacing: '1.5px' }}>
            Data Source
          </p>
          <FileDropZone onFileUploaded={onFileUploaded} />
        </div>

        {/* File Info */}
        {fileInfo && (
          <div className="rounded-xl p-3 border animate-fade-up"
            style={{ background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: '#22C55E', fontSize: '12px' }}>✓</span>
              <span className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>{fileInfo.filename}</span>
            </div>
            <div className="flex gap-3 text-xs mb-2" style={{ color: 'var(--muted)' }}>
              <span>{fileInfo.rows.toLocaleString()} rows</span>
              <span>·</span>
              <span>{fileInfo.columns} cols</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {fileInfo.column_names.map((col) => (
                <span key={col} className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(59,130,246,0.15)', color: '#93C5FD' }}>
                  {col}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Dashboards */}
        {dashboards && dashboards.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)', letterSpacing: '1.5px' }}>
              Dashboards ({dashboards.length})
            </p>
            <div className="flex flex-col gap-1.5">
              {dashboards.map((d) => (
                <div key={d.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border)' }}
                  onClick={() => onSelectDashboard(d)}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <span className="text-sm">📊</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{d.title}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{d.charts.length} charts</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteDashboard(d.id) }}
                    className="text-xs opacity-30 hover:opacity-100 transition-opacity shrink-0"
                    style={{ color: '#EF4444' }}
                  >✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chart Library */}
        <ChartLibrary
          charts={charts}
          onSelectChart={onSelectChart}
          onDeleteChart={onDeleteChart}
          onRenameChart={onRenameChart}
        />

      </div>

      {/* Bottom */}
      <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={async () => {
            const { resetModelSelection } = await import('../services/api')
            await resetModelSelection()
            window.location.reload()
          }}
          className="w-full text-xs py-2 rounded-xl border transition-all"
          style={{ color: 'var(--muted)', borderColor: 'var(--border)', background: 'transparent' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; e.currentTarget.style.color = 'var(--muted2)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
        >
          ⚙️ Change AI model
        </button>
        <p className="text-xs text-center mt-2" style={{ color: 'var(--muted)' }}>
          Local · Private · No cloud
        </p>
      </div>

    </div>
  )
}