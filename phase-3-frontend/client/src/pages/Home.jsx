import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import useChat from '../hooks/useChat'

export default function Home() {
  const [fileInfo, setFileInfo] = useState(null)
  const { messages, loading, sendMessage } = useChat()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar fileInfo={fileInfo} onFileUploaded={setFileInfo} />
      <ChatWindow
        messages={messages}
        loading={loading}
        onSendMessage={sendMessage}
        fileInfo={fileInfo}
      />
    </div>
  )
}