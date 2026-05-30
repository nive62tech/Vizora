import { useState } from 'react'

export default function useChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hi! Upload a CSV, Excel, or JSON file and I\'ll help you explore and visualize your data.',
    }
  ])
  const [loading, setLoading] = useState(false)

  const sendMessage = async (text, fileInfo) => {
    if (!text.trim()) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    // Placeholder response until Phase 4 connects real AI
    setTimeout(() => {
      const reply = fileInfo
        ? `You asked: "${text}"\n\nI can see your file "${fileInfo.filename}" has ${fileInfo.rows} rows and ${fileInfo.columns} columns: ${fileInfo.column_names.join(', ')}. AI responses will be live in Phase 4!`
        : `You asked: "${text}"\n\nPlease upload a data file first so I can help you analyze it.`

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: reply,
        },
      ])
      setLoading(false)
    }, 600)
  }

  return { messages, loading, sendMessage }
}