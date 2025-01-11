import { Injectable } from '@angular/core';
import {Client} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {Message} from "../models/message";

@Injectable({
  providedIn: 'root'
})
export class MessageWebsocketService {
  private stompClient: Client | null = null;
  private messagesSubject: BehaviorSubject<Message[]>;
  public messages$:Observable<Message[]>;

  constructor(private readonly authService: AuthService) {
    this.messagesSubject = new BehaviorSubject<Message[]>([]);
    this.messages$ = this.messagesSubject.asObservable();
  }

  connect(chatRoomId: number, size: number, page: number): void {
    this.stompClient = new Client({
      webSocketFactory: () => {
        const client: WebSocket = new SockJS('/flux-ws');
        return client;
      },
      reconnectDelay: 5000,
      onConnect: () => {
        // Subscribe to the topic
        this.stompClient?.subscribe('/topic/chatroom/messages', (message) => {
          if (message.body) {
            const parsedMessage: Message[] = JSON.parse(message.body);
            this.messagesSubject.next(parsedMessage);
          }
        });
        this.loadMessages(chatRoomId, size, page);
      },
      onStompError: (frame) => {},
      connectHeaders: {
        Authorization: `Bearer ${this.authService.getToken()}`
      },
    });

    this.stompClient.activate();
  }

  loadMessages(chatRoomId: number, size: number, page: number): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/chat.loadMessages',
        body: JSON.stringify({
          chatRoomId, page, size}),
      });
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}
