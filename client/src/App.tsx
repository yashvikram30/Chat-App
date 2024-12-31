import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  // State to store chat messages with initial "Hello from server!" message 
  const [messages, setMessages] = useState(["Hello from server!"])
  
  // Refs to store WebSocket connection and input element
  const wsRef = useRef<WebSocket | null>(null); // WebSocket connection reference
  const inputRef = useRef<HTMLInputElement | null>(null); // Input field reference

  useEffect(() => {
    // Create new WebSocket connection to local server
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;
    
    // Handle incoming messages from server
    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data]) // Add new message to messages array
    }

    // Cleanup function to close WebSocket connection when component unmounts
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    }
  }, []); // Empty dependency array to run effect only once

  return (
    <div className="App">
      {/* Render chat messages */}
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      {/* Input field for sending messages */}
      <input ref={inputRef} type="text" />
    </div>
  );
}

export default App;