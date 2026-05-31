export default function ExportButtons({ onExportPNG, onExportHTML, onExportPDF, size = 'normal' }) {
  const btnClass = size === 'small'
    ? 'text-xs px-2 py-1 rounded-lg'
    : 'text-xs px-3 py-1.5 rounded-lg'

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onExportPNG}
        className={`${btnClass} bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors font-medium`}
        title="Export as PNG image"
      >
        PNG
      </button>
      <button
        onClick={onExportHTML}
        className={`${btnClass} bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors font-medium`}
        title="Export as standalone HTML file"
      >
        HTML
      </button>
      <button
        onClick={onExportPDF}
        className={`${btnClass} bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors font-medium`}
        title="Export as PDF"
      >
        PDF
      </button>
    </div>
  )
}