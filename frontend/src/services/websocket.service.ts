import type { DetectionResponse } from "../types/prediction";

type MessageCallback = (data: DetectionResponse) => void;
type StatusCallback = (connected: boolean) => void;

class WebSocketService {
  private socket: WebSocket | null = null;

  private messageCallback?: MessageCallback;
  private statusCallback?: StatusCallback;

  private reconnectTimer: number | null = null;
  private reconnectDelay = 3000;

  private shouldReconnect = true;

  // ==========================================
  // CONNECT
  // ==========================================

  connect(
    token: string,
    onMessage: MessageCallback,
    onStatus?: StatusCallback
  ) {
    this.shouldReconnect = true;

    this.messageCallback = onMessage;
    this.statusCallback = onStatus;

    const protocol =
      window.location.protocol === "https:" ? "wss" : "ws";

    const host =
      import.meta.env.VITE_API_HOST ?? "localhost:8000";

    const url = `${protocol}://${host}/ws/live?token=${token}`;

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("✅ WebSocket Connected");
      this.statusCallback?.(true);
    };

    this.socket.onmessage = (event) => {
      try {
        const data: DetectionResponse = JSON.parse(event.data);
        this.messageCallback?.(data);
      } catch (error) {
        console.error("❌ WebSocket Parse Error:", error);
      }
    };

    this.socket.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    this.socket.onclose = () => {
      console.log("🔌 WebSocket Closed");

      this.statusCallback?.(false);

      if (this.shouldReconnect) {
        this.scheduleReconnect(token);
      }
    };
  }

  // ==========================================
  // SEND FRAME
  // ==========================================

  sendFrame(base64Image: string) {
    if (
      this.socket &&
      this.socket.readyState === WebSocket.OPEN
    ) {
      this.socket.send(
        JSON.stringify({
          image: base64Image,
        })
      );
    }
  }

  // ==========================================
  // RECONNECT
  // ==========================================

  private scheduleReconnect(token: string) {
    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = window.setTimeout(() => {
      if (this.messageCallback) {
        this.connect(
          token,
          this.messageCallback,
          this.statusCallback
        );
      }
    }, this.reconnectDelay);
  }

  // ==========================================
  // DISCONNECT
  // ==========================================

  disconnect() {
    this.shouldReconnect = false;

    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.socket?.close();
    this.socket = null;
  }

  // ==========================================
  // STATUS
  // ==========================================

  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();

export default websocketService;