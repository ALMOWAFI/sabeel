/**
 * Real-time Collaboration Service
 * 
 * Handles WebSocket connections, collaborative editing, and presence indicators
 */

import { User } from './AuthService';

export interface CollaborationEvent {
  type: 'user_joined' | 'user_left' | 'document_change' | 'cursor_move' | 'selection_change' | 'comment_added';
  userId: string;
  documentId: string;
  timestamp: number;
  data: any;
}

export interface DocumentChange {
  id: string;
  type: 'insert' | 'delete' | 'format';
  position: number;
  content?: string;
  length?: number;
  attributes?: Record<string, any>;
  userId: string;
  timestamp: number;
}

export interface CursorPosition {
  userId: string;
  position: number;
  selection?: {
    start: number;
    end: number;
  };
  color: string;
}

export interface CollaboratorInfo extends User {
  lastSeen: number;
  isActive: boolean;
  cursor?: CursorPosition;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  position: number;
  timestamp: number;
  replies: Comment[];
  resolved: boolean;
}

export class CollaborationService {
  private socket: WebSocket | null = null;
  private documentId: string;
  private userId: string;
  private collaborators = new Map<string, CollaboratorInfo>();
  private comments = new Map<string, Comment>();
  private eventListeners = new Map<string, Function[]>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isConnected = false;

  constructor(documentId: string, userId: string) {
    this.documentId = documentId;
    this.userId = userId;
    this.connect();
  }

  /**
   * Connect to WebSocket server
   */
  private connect(): void {
    const wsUrl = `${import.meta.env.WS_BASE_URL || 'ws://localhost:8080'}/documents/${this.documentId}`;
    
    try {
      this.socket = new WebSocket(wsUrl);
      this.setupEventHandlers();
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Set up WebSocket event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Send join message
      this.sendEvent({
        type: 'user_joined',
        userId: this.userId,
        documentId: this.documentId,
        timestamp: Date.now(),
        data: { userId: this.userId },
      });

      // Start heartbeat
      this.startHeartbeat();
      
      this.emit('connected');
    };

    this.socket.onmessage = (event) => {
      try {
        const collaborationEvent: CollaborationEvent = JSON.parse(event.data);
        this.handleEvent(collaborationEvent);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
      this.stopHeartbeat();
      this.emit('disconnected');
      this.scheduleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }

  /**
   * Handle incoming collaboration events
   */
  private handleEvent(event: CollaborationEvent): void {
    switch (event.type) {
      case 'user_joined':
        this.handleUserJoined(event.data);
        break;
      case 'user_left':
        this.handleUserLeft(event.data.userId);
        break;
      case 'document_change':
        this.handleDocumentChange(event.data);
        break;
      case 'cursor_move':
        this.handleCursorMove(event.data);
        break;
      case 'selection_change':
        this.handleSelectionChange(event.data);
        break;
      case 'comment_added':
        this.handleCommentAdded(event.data);
        break;
    }

    // Emit event to listeners
    this.emit(event.type, event.data);
  }

  /**
   * Handle user joined event
   */
  private handleUserJoined(userData: CollaboratorInfo): void {
    this.collaborators.set(userData.id, {
      ...userData,
      lastSeen: Date.now(),
      isActive: true,
    });
    
    this.emit('collaborator_joined', userData);
  }

  /**
   * Handle user left event
   */
  private handleUserLeft(userId: string): void {
    const collaborator = this.collaborators.get(userId);
    if (collaborator) {
      collaborator.isActive = false;
      collaborator.lastSeen = Date.now();
    }
    
    this.emit('collaborator_left', userId);
  }

  /**
   * Handle document change event
   */
  private handleDocumentChange(change: DocumentChange): void {
    // Don't process our own changes
    if (change.userId === this.userId) return;
    
    this.emit('document_change', change);
  }

  /**
   * Handle cursor movement
   */
  private handleCursorMove(cursorData: CursorPosition): void {
    const collaborator = this.collaborators.get(cursorData.userId);
    if (collaborator) {
      collaborator.cursor = cursorData;
      collaborator.lastSeen = Date.now();
    }
    
    this.emit('cursor_move', cursorData);
  }

  /**
   * Handle selection change
   */
  private handleSelectionChange(selectionData: CursorPosition): void {
    const collaborator = this.collaborators.get(selectionData.userId);
    if (collaborator) {
      collaborator.cursor = selectionData;
      collaborator.lastSeen = Date.now();
    }
    
    this.emit('selection_change', selectionData);
  }

  /**
   * Handle comment added
   */
  private handleCommentAdded(comment: Comment): void {
    this.comments.set(comment.id, comment);
    this.emit('comment_added', comment);
  }

  /**
   * Send document change
   */
  sendDocumentChange(change: Omit<DocumentChange, 'userId' | 'timestamp'>): void {
    const fullChange: DocumentChange = {
      ...change,
      userId: this.userId,
      timestamp: Date.now(),
    };

    this.sendEvent({
      type: 'document_change',
      userId: this.userId,
      documentId: this.documentId,
      timestamp: Date.now(),
      data: fullChange,
    });
  }

  /**
   * Send cursor position
   */
  sendCursorPosition(position: number, selection?: { start: number; end: number }): void {
    const cursorData: CursorPosition = {
      userId: this.userId,
      position,
      selection,
      color: this.getUserColor(this.userId),
    };

    this.sendEvent({
      type: 'cursor_move',
      userId: this.userId,
      documentId: this.documentId,
      timestamp: Date.now(),
      data: cursorData,
    });
  }

  /**
   * Send selection change
   */
  sendSelectionChange(start: number, end: number): void {
    const selectionData: CursorPosition = {
      userId: this.userId,
      position: start,
      selection: { start, end },
      color: this.getUserColor(this.userId),
    };

    this.sendEvent({
      type: 'selection_change',
      userId: this.userId,
      documentId: this.documentId,
      timestamp: Date.now(),
      data: selectionData,
    });
  }

  /**
   * Add comment
   */
  addComment(content: string, position: number, parentId?: string): void {
    const comment: Comment = {
      id: this.generateId(),
      userId: this.userId,
      content,
      position,
      timestamp: Date.now(),
      replies: [],
      resolved: false,
    };

    if (parentId) {
      const parentComment = this.comments.get(parentId);
      if (parentComment) {
        parentComment.replies.push(comment);
      }
    } else {
      this.comments.set(comment.id, comment);
    }

    this.sendEvent({
      type: 'comment_added',
      userId: this.userId,
      documentId: this.documentId,
      timestamp: Date.now(),
      data: comment,
    });
  }

  /**
   * Get all collaborators
   */
  getCollaborators(): CollaboratorInfo[] {
    return Array.from(this.collaborators.values());
  }

  /**
   * Get active collaborators
   */
  getActiveCollaborators(): CollaboratorInfo[] {
    const now = Date.now();
    const timeout = 30000; // 30 seconds

    return Array.from(this.collaborators.values()).filter(
      collaborator => collaborator.isActive && (now - collaborator.lastSeen) < timeout
    );
  }

  /**
   * Get all comments
   */
  getComments(): Comment[] {
    return Array.from(this.comments.values());
  }

  /**
   * Get comments at position
   */
  getCommentsAtPosition(position: number, range = 0): Comment[] {
    return Array.from(this.comments.values()).filter(
      comment => Math.abs(comment.position - position) <= range
    );
  }

  /**
   * Resolve comment
   */
  resolveComment(commentId: string): void {
    const comment = this.comments.get(commentId);
    if (comment) {
      comment.resolved = true;
      this.emit('comment_resolved', comment);
    }
  }

  /**
   * Add event listener
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  /**
   * Send event through WebSocket
   */
  private sendEvent(event: CollaborationEvent): void {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify(event));
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('max_reconnects_reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      this.connect();
    }, delay);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.isConnected) {
        this.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Get user color for cursor/selection display
   */
  private getUserColor(userId: string): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Check if connected
   */
  isConnectedToServer(): boolean {
    return this.isConnected;
  }

  /**
   * Disconnect from collaboration
   */
  disconnect(): void {
    if (this.socket) {
      this.sendEvent({
        type: 'user_left',
        userId: this.userId,
        documentId: this.documentId,
        timestamp: Date.now(),
        data: { userId: this.userId },
      });
      
      this.socket.close();
      this.socket = null;
    }
    
    this.stopHeartbeat();
    this.isConnected = false;
    this.collaborators.clear();
    this.comments.clear();
    this.eventListeners.clear();
  }
} 