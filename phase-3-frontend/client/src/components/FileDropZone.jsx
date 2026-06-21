import { useDropzone } from 'react-dropzone'
import { useState } from 'react'
import { uploadFile } from '../services/api'

export default function FileDropZone({ onFileUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const onDrop = async (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setError('Invalid file type. Please upload a CSV, Excel, or JSON file.')
      return
    }

    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await uploadFile(file)
      onFileUploaded(result)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot reach backend. Make sure uvicorn is running on port 8000.')
      } else {
        setError(err.response?.data?.detail || 'Failed to upload file. Try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-blue-400 bg-blue-400/10' :
            success ? 'border-green-400 bg-green-400/10' :
            error ? 'border-red-400/50 bg-red-400/5' :
            'border-gray-600 hover:border-gray-400 hover:bg-white/5'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <div className="text-3xl">
            {uploading ? '⏳' : success ? '✅' : isDragActive ? '📂' : '📁'}
          </div>
          {uploading ? (
            <p className="text-blue-400 text-xs">Uploading and parsing file...</p>
          ) : success ? (
            <p className="text-green-400 text-xs">File loaded successfully!</p>
          ) : isDragActive ? (
            <p className="text-blue-400 text-xs">Drop it here!</p>
          ) : (
            <>
              <p className="text-gray-300 text-xs font-medium">
                Drop a file or click to browse
              </p>
              <p className="text-gray-500 text-xs">
                CSV, Excel, JSON
              </p>
            </>
          )}
        </div>
      </div>
      {error && (
        <div className="mt-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}
    </div>
  )
}