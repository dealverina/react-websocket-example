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
        // "https://homelab-siswaku.oadcah.my.id/api/studentship/websocket/sockjs"
        "https://development-local-siswaku.oadcah.my.id/api/studentship/websocket/sockjs"
      }
      onConnect={() => console.log("connect")}
    >
      <Subscription />
    </StompSessionProvider>
  );
};

const Subscription = () => {
  const [lastMessage, setLastMessage] = useState(null);
  const [body, setBody] = useState({
    qrId: undefined,
  });
  const [repeater, setRepeater] = useState(0);
  const stompClient = useStompClient();

  useSubscription("/user/receive/presensi", (message) => {
    const responseJson = JSON.parse(message.body)
    setLastMessage(message.body);
    setBody({ qrId: responseJson?.qrId });
  });

  const generate = () => {
    if (stompClient) {
      if (stompClient) {
        console.log(body.qrId ? body : undefined)
        stompClient.publish({
          destination: "/ws/presensi",
          body: body.qrId ? JSON.stringify(body) : undefined
        });
      }
    }
  };

  useEffect(() => {
    generate();

    setTimeout(() => setRepeater((prevState) => prevState + 1), 10000);
  }, [repeater]);

  return <div>{lastMessage}</div>;
};

function App() {
  return (
    // <WebSocketDemo />
    <ReactStompHooks />
  );
}

export default App;
