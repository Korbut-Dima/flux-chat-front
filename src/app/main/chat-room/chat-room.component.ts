import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {map, Observable, of, switchMap} from "rxjs";
import {Chat} from "../../models/chat";
import {ActivatedRoute} from "@angular/router";
import {MessageWebsocketService} from "../../services/message-websocket.service";
import {MessageService} from "../../services/message.service";
import {Message, MessageType} from "../../models/message";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {UserChatParticipant} from "../../models/user-chat-participant";
import {NbSelectComponent} from "@nebular/theme";

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatRoomComponent implements OnInit{
  public chat?: Chat;
  public currentPage: number;
  public size: number;
  public messages: Message[];
  public userId: number;
  public users$: Observable<UserChatParticipant[]> = of([]);

  constructor(
    private readonly chatService: ChatService,
    private readonly messageWebsocketService: MessageWebsocketService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly cd: ChangeDetectorRef
  ) {
    this.currentPage = 0;
    this.size = 50;
    this.messages = [];
    this.userId = this.authService.getUserId();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(map(({ id }) => id), switchMap(id => this.chatService.getChatById(id)))
      .subscribe((chat) => {
        this.chat = chat;
        this.messageWebsocketService.connect(this.chat?.id, this.size, 0);
        this.size += 50;
        this.users$ = this.userService.getUsersOutOfChat$(this.chat.id);
        this.cd.detectChanges();
    });

    this.messageWebsocketService.messages$.subscribe((messages: Message[] | Message) => {
      this.messages = Array.isArray(messages) ? [...messages] : [...this.messages, messages];
      this.cd.detectChanges();
    });
  }

  loadMessages(): void {
    if (!this.chat) {
      return;
    }
    this.messageWebsocketService.loadMessages(this.chat?.id, this.size, 0);
  }

  sendMessage($event: { message: string }, chatId: number): void {
    this.messageService.sendMessage($event.message, MessageType.USER_TEXT, chatId).subscribe(() => {
    });
  }

  onSelectionEnd(select: NbSelectComponent, id: number): void {
    const ids: number[] = select.selected;
    select.selected = [];

    this.chatService.addToChat(id, ids).subscribe(() => {
      this.users$ = this.userService.getUsersOutOfChat$(id);
      this.cd.detectChanges();
    });
  }
}
