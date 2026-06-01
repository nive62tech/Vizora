import { useState, useEffect } from 'react'
import { getLanInfo } from '../services/api'

export default function LANBanner() {
  const [lanInfo, setLanInfo] = useState(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getLanInfo()
        setLanInfo(data)
      } catch (err) {
        console.error('Failed to get LAN info', err)
      }
    }
    fetch()
  }, [])

  if (!lanInfo || !visible) return null

  return (
    <div className="bg-[#1a1d27] border-b border-gray-800 px-6 py-2 flex items-center gap-3">
      <div className="flex items-center gap-2 flex-1">
        <span className="text-green-400 text-xs">🌐</span>
        <span className="text-gray-400 text-xs">
          LAN mode active — teammates on the same WiFi can open{' '}
          <span className="text-blue-400 font-mono font-medium">
            {lanInfo.frontend_url}
          </span>
          {' '}in their browser
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="text-gray-600 hover:text-gray-400 text-xs shrink-0"
      >
        ✕
      </button>
    </div>
  )
}