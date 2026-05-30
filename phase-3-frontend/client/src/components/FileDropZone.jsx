import { useDropzone } from 'react-dropzone'
import { useState } from 'react'
import { uploadFile } from '../services/api'

export default function FileDropZone({ onFileUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const result = await uploadFile(file)
      onFileUploaded(result)
    } catch (err) {
      setError('Failed to upload file. Make sure the backend is running.')
      console.error(err)
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
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive
            ? 'border-blue-400 bg-blue-400/10'
            : 'border-gray-600 hover:border-gray-400 hover:bg-white/5'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="text-4xl">📂</div>
          {uploading ? (
            <p className="text-blue-400 text-sm">Uploading...</p>
          ) : isDragActive ? (
            <p className="text-blue-400 text-sm">Drop your file here</p>
          ) : (
            <>
              <p className="text-gray-300 text-sm font-medium">
                Drop a file here or click to browse
              </p>
              <p className="text-gray-500 text-xs">
                Supports CSV, Excel (.xlsx, .xls), and JSON
              </p>
            </>
          )}
        </div>
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-2 text-center">{error}</p>
      )}
    </div>
  )
}