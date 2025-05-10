/**
 * CollaborationService.ts
 * 
 * Service for handling real-time collaboration features
 * using WebSockets for the Sabeel platform.
 */

import { User } from './AuthService';

// Types for collaboration events
export type CollaborationEventType = 
  | 'user_joined'
  | 'user_left'
  | 'cursor_move'
  | 'document_change'
  | 'comment_added'
  | 'comment_updated'
  | 'comment_deleted'
  | 'presence_update';

export interface CollaborationEvent {
  type: CollaborationEventType;
  userId: string;
  documentId: string;
  timestamp: number;
  data: any;
}

export interface DocumentChange {
  path: string;
  operations: Array<{
    type: 'insert' | 'delete' | 'replace';
    position: number;
    text?: string;
    length?: number;
  }>;
  version: number;
}

export interface CursorPosition {
  userId: string;
  path: string;
  position: number;
  selection?: { start: number; end: number };
}

export interface CollaboratorInfo {
  user: User;
  lastActive: number;
  cursorPosition?: CursorPosition;
}

/**
 * Service for managing real-time collaboration
 */
export class CollaborationService {
  private socket: WebSocket | null = null;
  private documentId: string;
  private collaborators: Map<string, CollaboratorInfo> = new Map();
  private eventListeners: Map<CollaborationEventType, Array<(event: CollaborationEvent) => void>> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000; // Start with 1 second delay
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private connectionStatus: 'connecting' | 'connected' | 'disconnected' = 'disconnected';
  private userId: string;
  private documentVersion: number = 0;
  private pendingChanges: DocumentChange[] = [];

  /**
   * Create a new collaboration service instance
   * @param documentId - ID of the document to collaborate on
   * @param userId - ID of the current user
   * @param wsUrl - WebSocket server URL
   */
  constructor(documentId: string, userId: string, wsUrl: string = 'wss://api.sabeel.app/ws') {
    this.documentId = documentId;
    this.userId = userId;
    this.connect(`${wsUrl}/documents/${documentId}?userId=${userId}`);
  }

  /**
   * Connect to the WebSocket server
   * @param url - WebSocket URL
   */
  private connect(url: string): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return; // Already connected or connecting
    }

    this.connectionStatus = 'connecting';
    this.socket = new WebSocket(url);

    this.socket.onopen = this.handleOpen.bind(this);
    this.socket.onmessage = this.handleMessage.bind(this);
    this.socket.onclose = this.handleClose.bind(this);
    this.socket.onerror = this.handleError.bind(this);
  }

  /**
   * Handle WebSocket open event
   */
  private handleOpen(): void {
    console.log('WebSocket connection established');
    this.connectionStatus = 'connected';
    this.reconnectAttempts = 0;
    this.startHeartbeat();

    // Send any pending changes
    this.sendPendingChanges();

    // Notify listeners of connection
    this.emit('connection_established', {});
  }

  /**
   * Handle WebSocket message event
   * @param event - WebSocket message event
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data) as CollaborationEvent;
      
      switch (data.type) {
        case 'user_joined':
          this.handleUserJoined(data);
          break;
        case 'user_left':
          this.handleUserLeft(data);
          break;
        case 'cursor_move':
          this.handleCursorMove(data);
          break;
        case 'document_change':
          this.handleDocumentChange(data);
          break;
        case 'comment_added':
        case 'comment_updated':
        case 'comment_deleted':
          this.handleCommentEvent(data);
          break;
        case 'presence_update':
          this.handlePresenceUpdate(data);
          break;
        default:
          console.warn('Unknown event type:', data.type);
      }

      // Dispatch event to listeners
      this.dispatchEvent(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Handle WebSocket close event
   * @param event - WebSocket close event
   */
  private handleClose(event: CloseEvent): void {
    console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
    this.connectionStatus = 'disconnected';
    this.stopHeartbeat();

    // Attempt to reconnect if not a normal closure
    if (event.code !== 1000 && event.code !== 1001) {
      this.attemptReconnect();
    }
  }

  /**
   * Handle WebSocket error event
   * @param event - WebSocket error event
   */
  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
    // Error handling will be followed by a close event
  }

  /**
   * Attempt to reconnect to the WebSocket server
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnection attempts reached');
      this.emit('connection_failed', { attempts: this.reconnectAttempts });
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(30000, this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)); // Exponential backoff

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect(`wss://api.sabeel.app/ws/documents/${this.documentId}?userId=${this.userId}`);
    }, delay);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.stopHeartbeat(); // Clear any existing interval
    
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  /**
   * Stop heartbeat interval
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Handle user joined event
   * @param event - User joined event
   */
  private handleUserJoined(event: CollaborationEvent): void {
    const userData = event.data.user as User;
    
    this.collaborators.set(userData.id, {
      user: userData,
      lastActive: Date.now()
    });

    console.log(`User joined: ${userData.name}`);
  }

  /**
   * Handle user left event
   * @param event - User left event
   */
  private handleUserLeft(event: CollaborationEvent): void {
    const userId = event.data.userId;
    this.collaborators.delete(userId);
    console.log(`User left: ${userId}`);
  }

  /**
   * Handle cursor move event
   * @param event - Cursor move event
   */
  private handleCursorMove(event: CollaborationEvent): void {
    const cursorData = event.data as CursorPosition;
    const collaborator = this.collaborators.get(cursorData.userId);
    
    if (collaborator) {
      collaborator.cursorPosition = cursorData;
      collaborator.lastActive = Date.now();
      this.collaborators.set(cursorData.userId, collaborator);
    }
  }

  /**
   * Handle document change event
   * @param event - Document change event
   */
  private handleDocumentChange(event: CollaborationEvent): void {
    const changeData = event.data as DocumentChange;
    
    // Update document version
    if (changeData.version > this.documentVersion) {
      this.documentVersion = changeData.version;
    }
    
    // Update collaborator's last active timestamp
    const collaborator = this.collaborators.get(event.userId);
    if (collaborator) {
      collaborator.lastActive = Date.now();
      this.collaborators.set(event.userId, collaborator);
    }
  }

  /**
   * Handle comment events
   * @param event - Comment event
   */
  private handleCommentEvent(event: CollaborationEvent): void {
    // Update collaborator's last active timestamp
    const collaborator = this.collaborators.get(event.userId);
    if (collaborator) {
      collaborator.lastActive = Date.now();
      this.collaborators.set(event.userId, collaborator);
    }
  }

  /**
   * Handle presence update event
   * @param event - Presence update event
   */
  private handlePresenceUpdate(event: CollaborationEvent): void {
    const presenceData = event.data.collaborators as Record<string, CollaboratorInfo>;
    
    // Update collaborators map with presence information
    Object.entries(presenceData).forEach(([userId, info]) => {
      this.collaborators.set(userId, info);
    });
  }

  /**
   * Send document changes to the server
   * @param change - Document change to send
   */
  public sendDocumentChange(change: Omit<DocumentChange, 'version'>): void {
    const fullChange: DocumentChange = {
      ...change,
      version: this.documentVersion + 1
    };

    if (this.connectionStatus === 'connected' && this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'document_change',
        userId: this.userId,
        documentId: this.documentId,
        timestamp: Date.now(),
        data: fullChange
      }));
      
      this.documentVersion++;
    } else {
      // Store change to send when connection is established
      this.pendingChanges.push(fullChange);
    }
  }

  /**
   * Send cursor position to the server
   * @param position - Cursor position
   */
  public sendCursorPosition(position: Omit<CursorPosition, 'userId'>): void {
    if (this.connectionStatus === 'connected' && this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'cursor_move',
        userId: this.userId,
        documentId: this.documentId,
        timestamp: Date.now(),
        data: {
          ...position,
          userId: this.userId
        }
      }));
    }
  }

  /**
   * Send pending changes to the server
   */
  private sendPendingChanges(): void {
    if (this.pendingChanges.length === 0) return;
    
    console.log(`Sending ${this.pendingChanges.length} pending changes`);
    
    for (const change of this.pendingChanges) {
      this.socket?.send(JSON.stringify({
        type: 'document_change',
        userId: this.userId,
        documentId: this.documentId,
        timestamp: Date.now(),
        data: change
      }));
    }
    
    // Clear pending changes
    this.pendingChanges = [];
  }

  /**
   * Add a comment to the document
   * @param path - Path to the commented element
   * @param text - Comment text
   * @param range - Text range the comment applies to
   */
  public addComment(path: string, text: string, range?: { start: number; end: number }): void {
    if (this.connectionStatus === 'connected' && this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'comment_added',
        userId: this.userId,
        documentId: this.documentId,
        timestamp: Date.now(),
        data: {
          path,
          text,
          range,
          commentId: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }
      }));
    }
  }

  /**
   * Get all active collaborators
   * @returns Map of collaborator information
   */
  public getCollaborators(): Map<string, CollaboratorInfo> {
    return new Map(this.collaborators);
  }

  /**
   * Register an event listener
   * @param eventType - Type of event to listen for
   * @param callback - Callback function
   */
  public on(eventType: CollaborationEventType, callback: (event: CollaborationEvent) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    
    this.eventListeners.get(eventType)?.push(callback);
  }

  /**
   * Remove an event listener
   * @param eventType - Type of event
   * @param callback - Callback function to remove
   */
  public off(eventType: CollaborationEventType, callback: (event: CollaborationEvent) => void): void {
    const listeners = this.eventListeners.get(eventType);
    
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Dispatch an event to registered listeners
   * @param event - Event to dispatch
   */
  private dispatchEvent(event: CollaborationEvent): void {
    const listeners = this.eventListeners.get(event.type);
    
    if (listeners) {
      for (const callback of listeners) {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      }
    }
  }

  /**
   * Emit a custom event
   * @param type - Event type
   * @param data - Event data
   */
  private emit(type: string, data: any): void {
    const event = {
      type: type as CollaborationEventType,
      userId: this.userId,
      documentId: this.documentId,
      timestamp: Date.now(),
      data
    };
    
    this.dispatchEvent(event);
  }

  /**
   * Close the WebSocket connection
   */
  public disconnect(): void {
    this.stopHeartbeat();
    
    if (this.socket) {
      this.socket.onclose = null; // Prevent reconnection attempts
      this.socket.close(1000, 'User disconnected');
      this.socket = null;
    }
    
    this.connectionStatus = 'disconnected';
  }
}