import ChartDisplay from './ChartDisplay'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`
          max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed
          ${isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-[#1a1d27] text-gray-200 rounded-bl-sm border border-gray-800'
          }
        `}
      >
        {message.content}
      </div>
      {message.chart && <ChartDisplay chart={message.chart} />}
    </div>
  )
}