// src/lib/websocket/websocket.ts
import type { RealtimeEvent } from "./realtime.types";

function getWebSocketUrl(): string {
  const url = process.env.NEXT_PUBLIC_WS_URL;
  if (!url) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NEXT_PUBLIC_WS_URL is required in production");
    }
    return "ws://localhost:8000";
  }
  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    url.startsWith("ws://")
  ) {
    throw new Error("NEXT_PUBLIC_WS_URL must use wss:// when app is served over https");
  }
  if (process.env.NODE_ENV === "production" && url.startsWith("ws://")) {
    // Allow ws:// during `next build` prerender (no window) but fail in browser on https
    if (typeof window !== "undefined") {
      throw new Error("NEXT_PUBLIC_WS_URL must use wss:// in production");
    }
  }
  return url;
}

const BASE_DELAY_MS = 1_000;
const MAX_DELAY_MS = 30_000;

type EventType = keyof RealtimeEvent;
type EventHandler = (payload: never) => void;

/**
 * Centralized WebSocket manager.
 *
 * Maintains a single WebSocket connection shared across the application.
 * Domain hooks subscribe to project channels and register event listeners;
 * the manager owns the connection lifecycle, reconnection (with exponential
 * backoff), resubscription after reconnect, and event dispatching.
 *
 * This module intentionally contains no React Query or UI/domain business
 * logic.
 */
class WebSocketManager {
  private socket: WebSocket | null = null;
  private subscriptions = new Set<string>();
  private handlers = new Map<EventType, Set<EventHandler>>();
  private reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  private attempt = 0;
  private intentionallyClosed = false;

  connect() {
    if (this.socket) {
      return;
    }

    this.intentionallyClosed = false;
    this.open();
  }

  disconnect() {
    this.intentionallyClosed = true;

    this.subscriptions.clear();

    if (this.reconnectTimer !== undefined) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }

    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      this.socket.close();
    }

    this.socket = null;
  }

  subscribe(projectId: string) {
    if (this.subscriptions.has(projectId)) {
      return;
    }

    this.subscriptions.add(projectId);
    this.sendSubscription(projectId);
  }

  unsubscribe(projectId: string) {
    if (!this.subscriptions.delete(projectId)) {
      return;
    }

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "project.unsubscribe",
          data: { projectId },
        }),
      );
    }
  }

  on<T extends EventType>(
    type: T,
    handler: (payload: RealtimeEvent[T]) => void,
  ): () => void {
    let set = this.handlers.get(type);

    if (!set) {
      set = new Set();
      this.handlers.set(type, set);
    }

    const wrapped = handler as EventHandler;
    set.add(wrapped);

    return () => {
      set?.delete(wrapped);
    };
  }

  private open() {
    if (this.intentionallyClosed) {
      return;
    }

    let WS_URL: string;
    try {
      WS_URL = getWebSocketUrl();
    } catch (error) {
      console.error("[WS]", (error as Error).message);
      return;
    }

    const socket = new WebSocket(WS_URL);
    this.socket = socket;

    socket.onopen = () => {
      if (this.intentionallyClosed) {
        return;
      }

      this.attempt = 0;
      this.resubscribeAll();
    };

    socket.onmessage = (event) => this.handleMessage(event);

    socket.onerror = () => {
      if (this.intentionallyClosed) {
        return;
      }

      console.error("[WS] Connection error");
    };

    socket.onclose = () => {
      if (this.intentionallyClosed || this.socket !== socket) {
        return;
      }

      this.socket = null;

      const delay = Math.min(
        BASE_DELAY_MS * Math.pow(2, this.attempt),
        MAX_DELAY_MS,
      );

      this.attempt += 1;

      this.reconnectTimer = setTimeout(() => this.open(), delay);
    };
  }

  private resubscribeAll() {
    for (const projectId of this.subscriptions) {
      this.sendSubscription(projectId);
    }
  }

  private sendSubscription(projectId: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "project.subscribe",
          data: { projectId },
        }),
      );
    }
  }

  private handleMessage(event: MessageEvent) {
    let message: { type: string; data?: unknown };

    try {
      message = JSON.parse(event.data);
    } catch {
      console.error("[WS] Received malformed message");
      return;
    }

    if (!message || typeof message !== "object" || typeof message.type !== "string") {
      return;
    }

    const handlers = this.handlers.get(message.type as EventType);

    if (!handlers) {
      return;
    }

    for (const handler of handlers) {
      try {
        handler(message.data as never);
      } catch (error) {
        console.error("[WS] Handler error:", error);
      }
    }
  }
}

export const websocketManager = new WebSocketManager();
