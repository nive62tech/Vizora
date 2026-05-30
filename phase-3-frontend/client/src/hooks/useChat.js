import { useState } from 'react'
import api from '../services/api'

export default function useChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! Upload a CSV, Excel, or JSON file and I'll help you explore and visualize your data.",
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

    try {
      const response = await api.post('/chat', {
        message: text,
        column_names: fileInfo?.column_names || [],
        preview: fileInfo?.preview || [],
        filename: fileInfo?.filename || '',
      })

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.data.response,
        },
      ])
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Something went wrong. Make sure Ollama is running.'
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: `Error: ${errorMsg}`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return { messages, loading, sendMessage }
}