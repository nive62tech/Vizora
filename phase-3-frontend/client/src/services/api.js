import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
})

export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const checkHealth = async () => {
  const response = await api.get('/health')
  return response.data
}

export const generateChart = async (message, fileInfo) => {
  const response = await api.post('/charts/generate', {
    message,
    column_names: fileInfo.column_names,
    data: fileInfo.preview,
    filename: fileInfo.filename,
  })
  return response.data
}

export const saveChart = async (chart, filename) => {
  const response = await api.post('/library/save', { ...chart, filename })
  return response.data
}

export const getAllCharts = async () => {
  const response = await api.get('/library/charts')
  return response.data.charts
}

export const deleteChart = async (chartId) => {
  const response = await api.delete(`/library/charts/${chartId}`)
  return response.data
}

export const renameChart = async (chartId, title) => {
  const response = await api.patch(`/library/charts/${chartId}`, { title })
  return response.data
}

export const buildDashboard = async (message) => {
  const response = await api.post('/dashboard/build', { message })
  return response.data
}

export const getAllDashboards = async () => {
  const response = await api.get('/dashboard/all')
  return response.data.dashboards
}

export const deleteDashboard = async (dashboardId) => {
  const response = await api.delete(`/dashboard/${dashboardId}`)
  return response.data
}

export const renameDashboard = async (dashboardId, title) => {
  const response = await api.patch(`/dashboard/${dashboardId}`, { title })
  return response.data
}

export default api