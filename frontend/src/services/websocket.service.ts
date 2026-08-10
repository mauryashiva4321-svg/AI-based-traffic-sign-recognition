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

    // Get deployed backend URL from Vercel environment variable
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      console.error("❌ VITE_API_URL is not configured");
      this.statusCallback?.(false);
      return;
    }

    // Convert HTTP/HTTPS URL to WS/WSS
    const wsUrl = apiUrl
      .replace(/^https:\/\//, "wss://")
      .replace(/^http:\/\//, "ws://");

    // Backend WebSocket endpoint
    const url = `${wsUrl}/ws/live?token=${encodeURIComponent(token)}`;

    console.log("🔌 Connecting WebSocket:", url);

    this.socket = new WebSocket(url);

    // ==========================================
    // CONNECTED
    // ==========================================

    this.socket.onopen = () => {
      console.log("✅ WebSocket Connected");
      this.statusCallback?.(true);
    };

    // ==========================================
    // MESSAGE
    // ==========================================

    this.socket.onmessage = (event) => {
      try {
        const data: DetectionResponse = JSON.parse(event.data);

        this.messageCallback?.(data);
      } catch (error) {
        console.error("❌ WebSocket Parse Error:", error);
      }
    };

    // ==========================================
    // ERROR
    // ==========================================

    this.socket.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
      this.statusCallback?.(false);
    };

    // ==========================================
    // CLOSED
    // ==========================================

    this.socket.onclose = (event) => {
      console.log(
        "🔌 WebSocket Closed:",
        event.code,
        event.reason
      );

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
    } else {
      console.warn(
        "⚠️ WebSocket is not connected. Frame not sent."
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
      if (
        this.shouldReconnect &&
        this.messageCallback
      ) {
        console.log("🔄 Reconnecting WebSocket...");

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

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    console.log("🔌 WebSocket disconnected manually");
  }

  // ==========================================
  // STATUS
  // ==========================================

  isConnected() {
    return (
      this.socket?.readyState === WebSocket.OPEN
    );
  }
}

export const websocketService =
  new WebSocketService();

export default websocketService;