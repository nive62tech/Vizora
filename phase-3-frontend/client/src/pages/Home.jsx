import { useState, useEffect, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import DashboardView from '../components/DashboardView'
import LANBanner from '../components/LANBanner'
import useChat from '../hooks/useChat'
import { getAllCharts, deleteChart, getAllDashboards, deleteDashboard, renameDashboard } from '../services/api'

export default function Home() {
  const [fileInfo, setFileInfo] = useState(null)
  const [charts, setCharts] = useState([])
  const [selectedChart, setSelectedChart] = useState(null)
  const [activeDashboard, setActiveDashboard] = useState(null)
  const [dashboards, setDashboards] = useState([])

  const fetchCharts = useCallback(async () => {
    try {
      const data = await getAllCharts()
      setCharts(data)
    } catch (err) {
      console.error('Failed to fetch charts', err)
    }
  }, [])

  const fetchDashboards = useCallback(async () => {
    try {
      const data = await getAllDashboards()
      setDashboards(data)
    } catch (err) {
      console.error('Failed to fetch dashboards', err)
    }
  }, [])

  useEffect(() => {
    fetchCharts()
    fetchDashboards()
  }, [fetchCharts, fetchDashboards])

  const handleChartSaved = useCallback(() => {
    fetchCharts()
  }, [fetchCharts])

  const handleDashboardBuilt = useCallback((dashboard) => {
    setActiveDashboard(dashboard)
    setSelectedChart(null)
    fetchDashboards()
  }, [fetchDashboards])

  const handleDeleteChart = async (chartId) => {
    try {
      await deleteChart(chartId)
      fetchCharts()
      if (selectedChart?.id === chartId) setSelectedChart(null)
    } catch (err) {
      console.error('Failed to delete chart', err)
    }
  }

  const handleRenameDashboard = async (dashboardId, title) => {
    try {
      await renameDashboard(dashboardId, title)
      fetchDashboards()
      if (activeDashboard?.id === dashboardId) {
        setActiveDashboard(prev => ({ ...prev, title }))
      }
    } catch (err) {
      console.error('Failed to rename dashboard', err)
    }
  }

  const { messages, loading, sendMessage } = useChat(handleChartSaved, handleDashboardBuilt)

  const mainContent = activeDashboard ? (
    <DashboardView
      dashboard={activeDashboard}
      onClose={() => setActiveDashboard(null)}
      onRename={handleRenameDashboard}
    />
  ) : (
    <ChatWindow
      messages={messages}
      loading={loading}
      onSendMessage={sendMessage}
      fileInfo={fileInfo}
      selectedChart={selectedChart}
      onClearSelectedChart={() => setSelectedChart(null)}
    />
  )

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <LANBanner />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          fileInfo={fileInfo}
          onFileUploaded={setFileInfo}
          charts={charts}
          onSelectChart={(chart) => {
            setSelectedChart(chart)
            setActiveDashboard(null)
          }}
          onDeleteChart={handleDeleteChart}
          onRenameChart={() => {}}
          dashboards={dashboards}
          onSelectDashboard={(d) => {
            setActiveDashboard(d)
            setSelectedChart(null)
          }}
          onDeleteDashboard={async (id) => {
            await deleteDashboard(id)
            fetchDashboards()
            if (activeDashboard?.id === id) setActiveDashboard(null)
          }}
        />
        {mainContent}
      </div>
    </div>
  )
}