import { useState, useEffect, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import useChat from '../hooks/useChat'
import { getAllCharts, deleteChart } from '../services/api'

export default function Home() {
  const [fileInfo, setFileInfo] = useState(null)
  const [charts, setCharts] = useState([])
  const [selectedChart, setSelectedChart] = useState(null)

  const fetchCharts = useCallback(async () => {
    try {
      const data = await getAllCharts()
      setCharts(data)
    } catch (err) {
      console.error('Failed to fetch charts', err)
    }
  }, [])

  useEffect(() => {
    fetchCharts()
  }, [fetchCharts])

  const handleChartSaved = useCallback(() => {
    fetchCharts()
  }, [fetchCharts])

  const handleDeleteChart = async (chartId) => {
    try {
      await deleteChart(chartId)
      fetchCharts()
      if (selectedChart?.id === chartId) setSelectedChart(null)
    } catch (err) {
      console.error('Failed to delete chart', err)
    }
  }

  const { messages, loading, sendMessage } = useChat(handleChartSaved)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        fileInfo={fileInfo}
        onFileUploaded={setFileInfo}
        charts={charts}
        onSelectChart={setSelectedChart}
        onDeleteChart={handleDeleteChart}
        onRenameChart={() => {}}
      />
      <ChatWindow
        messages={messages}
        loading={loading}
        onSendMessage={sendMessage}
        fileInfo={fileInfo}
        selectedChart={selectedChart}
        onClearSelectedChart={() => setSelectedChart(null)}
      />
    </div>
  )
}