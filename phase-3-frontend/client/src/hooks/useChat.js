import { useState } from 'react'
import api, { generateChart } from '../services/api'

const CHART_KEYWORDS = ['chart', 'plot', 'graph', 'visualize', 'visualise', 'bar', 'line', 'pie', 'scatter', 'histogram', 'show me']

function isChartRequest(message) {
  const lower = message.toLowerCase()
  return CHART_KEYWORDS.some(keyword => lower.includes(keyword))
}

export default function useChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! Upload a CSV, Excel, or JSON file and I'll help you explore and visualize your data. Ask me to create charts or analyze your data!",
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
      if (isChartRequest(text) && fileInfo) {
        // Generate a chart
        const chartData = await generateChart(text, fileInfo)

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: `Here's ${chartData.title} — a ${chartData.chart_type} chart showing ${chartData.y_col} by ${chartData.x_col}.`,
            chart: chartData,
          },
        ])
      } else {
        // Regular AI chat
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
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Something went wrong. Make sure backend and Ollama are running.'
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