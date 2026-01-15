import { useShallow } from "zustand/react/shallow";
import useAppStore from "./useAppStore";

type Handler<E> = (event: E) => void;

class EventDispatcher<E> { 
    private handlers: Handler<E>[] = [];
    fire(event: E) { 
        for (let h of this.handlers)
            h(event);
    }
    register(handler: Handler<E>) { 
        this.handlers.push(handler);
    }
}

interface MessageEvent {
    data: any;
}
interface ConnectEvent {}
interface CloseEvent {}

export class WebsocketService {
    private static instance: WebsocketService;

    private connected: boolean = false;

    private socket?: WebSocket;

    private messageEvent = new EventDispatcher<MessageEvent>();

    private connectEvent = new EventDispatcher<ConnectEvent>();

    private closeEvent = new EventDispatcher<CloseEvent>();

    private errorEvent = new EventDispatcher<Event>();


    private constructor() {}

    public static getInstance(): WebsocketService {
        if (!WebsocketService.instance) {
        WebsocketService.instance = new WebsocketService();
        }
        return WebsocketService.instance;
    }

    public connect(webSocketURL: string) {
        if (this.connected || webSocketURL === "") return;

        // Create a new WebSocket instance
        this.socket = new WebSocket(webSocketURL);

        // Event handler for when the WebSocket connection is established
        this.socket.onopen = () => {
            this.connected = true;
            this.connectEvent.fire({});
        };

        // Event handler for when the WebSocket receives a message
        this.socket.onmessage = (event) => {
            // Parse the received message
            console.log("WebSocket connected.");
            const data = JSON.parse(event.data);
            this.messageEvent.fire({data})
        };

        // Event handler for WebSocket errors
        this.socket.onerror = (error) => {
            this.errorEvent.fire(error)
            console.error("WebSocket error:", error);
        };

        this.socket.onclose = (e) => {
            this.connected = false;
            this.closeEvent.fire({});
        };
    }

    public onMessageEvent (handler: Handler<MessageEvent>) {
        this.messageEvent.register(handler);
    }

    public onConnectEvent (handler: Handler<ConnectEvent>) {
        this.connectEvent.register(handler);
    }

    public onCloseEvent (handler: Handler<CloseEvent>) {
        this.closeEvent.register(handler);
    }

    public onErrorEvent (handler: Handler<Event>) {
        this.errorEvent.register(handler);
    }

    public close() {
        this.socket?.close();
    }

    public isConnected () {
        return this.connected;
    }
}