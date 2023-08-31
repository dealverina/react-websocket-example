import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect, useState } from "react";

const WebSocketDemo = () => {
  const socketUrl = "wss://echo.websocket.events";
  const [messageHistory, setMessageHistory] = useState([]);
  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened', new Date()),
    shouldReconnect: (closeEvent) => true,
    onReconnectStop: 1000,
    onClose: () => console.log('closed', new Date()),
    reconnectInterval: 1000,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>The WebSocket is currently {connectionStatus}</div>
  )
};

function App() {
  return (
    <WebSocketDemo />
  );
}

export default App;
