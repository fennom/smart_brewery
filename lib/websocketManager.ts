import { WebsocketService } from './WebsocketService';
import useAppStore from './useAppStore';

let initialized = false;

export function initializeWebSocket() {
  if (initialized) {
    return;
  }
  initialized = true;

  const websocketService = WebsocketService.getInstance();

  const connect = () => {
    // close any existing connection before opening a new one
    if (websocketService.isConnected()) {
        websocketService.close();
    }
    const webSocketURL = useAppStore.getState().getWebsocketUrl();
    if (webSocketURL) {
      console.log('Connecting to WebSocket:', webSocketURL);
      websocketService.connect(webSocketURL);
    }
  };

  websocketService.onMessageEvent((event) => {
    useAppStore.getState().setState(event.data);
  });

  websocketService.onConnectEvonMessageEventent(() => {
    useAppStore.getState().setIsOnline(true);
  });

  websocketService.onCloseEvent(() => {
    useAppStore.getState().setIsOnline(false);
  });

  websocketService.onErrorEvent((error) => {
    console.error("WebSocket error in manager:", error);
    useAppStore.getState().setIsOnline(false);
  });

  // Connect initially
  connect();

  // Reconnect if IP changes
  useAppStore.subscribe(
    (state, prevState) => {
      if (state.ip === prevState.ip) return;
      console.log('IP address changed, reconnecting WebSocket...');
      connect();
    }
  );
}
