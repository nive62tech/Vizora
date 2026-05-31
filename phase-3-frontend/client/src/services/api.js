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

export default api