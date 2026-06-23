const FILTERS = [
  { icon: '📊', label: 'Bar chart', prompt: 'Show me a bar chart' },
  { icon: '📈', label: 'Line chart', prompt: 'Show me a line chart' },
  { icon: '🥧', label: 'Pie chart', prompt: 'Create a pie chart' },
  { icon: '🔵', label: 'Scatter', prompt: 'Show me a scatter plot' },
  { icon: '📋', label: 'Summary', prompt: 'Summarize this data' },
  { icon: '🏆', label: 'Top values', prompt: 'What are the top 5 values?' },
  { icon: '📉', label: 'Distribution', prompt: 'Show distribution as histogram' },
  { icon: '💡', label: 'Insights', prompt: 'What insights can you find in this data?' },
]

export default function QuickFilters({ onSelect, fileInfo }) {
  if (!fileInfo) return null

  return (
    <div className="shrink-0 px-6 py-2 border-b overflow-x-auto"
      style={{ borderColor: 'var(--border)', background: 'rgba(13,17,23,0.6)' }}>
      <div className="flex gap-2 w-max">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => onSelect(f.prompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              color: 'var(--muted2)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'
              e.currentTarget.style.background = 'rgba(59,130,246,0.08)'
              e.currentTarget.style.color = '#93C5FD'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.color = 'var(--muted2)'
            }}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}