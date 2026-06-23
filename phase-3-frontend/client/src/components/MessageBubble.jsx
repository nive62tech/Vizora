import ChartDisplay from './ChartDisplay'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="flex flex-col gap-2 max-w-[78%]">
        <div
          className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
          style={isUser ? {
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
            color: 'white',
            borderBottomRightRadius: '4px',
            boxShadow: '0 4px 20px rgba(59,130,246,0.25)',
          } : {
            background: 'rgba(13,17,23,0.9)',
            color: 'var(--muted2)',
            border: '1px solid var(--border)',
            borderBottomLeftRadius: '4px',
          }}
        >
          {message.content}
        </div>
        {message.chart && <ChartDisplay chart={message.chart} />}
      </div>
    </div>
  )
}