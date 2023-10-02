import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect, useState } from "react";
import {
  StompSessionProvider,
  useStompClient,
  useSubscription,
} from "react-stomp-hooks";

// WEBSOCKET DEMO
const WebSocketDemo = () => {
  const socketUrl = "wss://echo.websocket.events";
  const [messageHistory, setMessageHistory] = useState([]);
  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened", new Date()),
    shouldReconnect: (closeEvent) => true,
    onReconnectStop: 1000,
    onClose: () => console.log("closed", new Date()),
    reconnectInterval: 1000,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return <div>The WebSocket is currently {connectionStatus}</div>;
};

// REACT STOMP HOOKS
const ReactStompHooks = () => {
  return (
    <StompSessionProvider
      url={
        "https://homelab-siswaku.oadcah.my.id/api/studentship/websocket/sockjs"
      }
      onConnect={() => console.log("connect")}
    >
      <InitQrCode />
      <Subscription />
    </StompSessionProvider>
  );
};

const Subscription = () => {
  const [lastMessage, setLastMessage] = useState([]);

  useSubscription("/user/receive/presensi", (message) => {
    setLastMessage([...lastMessage, message.body]);
  });

  return (
    <div>
      {lastMessage.map((value, index) => (
        <div key={index}>{value}</div>
      ))}
    </div>
  );
};

const InitQrCode = () => {
  const stompClient = useStompClient();

  const generate = () => {
    console.log("generate");
    if (stompClient) {
      if (stompClient) {
        stompClient.publish({
          destination: "/ws/presensi",
        });
      }
    }
  };

  return <button onClick={generate}>Generate Qr Code</button>;
};

function App() {
  return (
    // <WebSocketDemo />
    <ReactStompHooks />
  );
}

export default App;
