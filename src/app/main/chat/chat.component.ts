import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {Chat} from "../../models/chat";
import {FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NbToastrService} from "@nebular/theme";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {
  public chats: Chat[] = [];
  public nameControl: FormControl<string | null>;

  constructor(
    private readonly chatService: ChatService,
    private readonly router: Router,
    private readonly cd: ChangeDetectorRef,
    private readonly toastrService: NbToastrService
  ) {
    this.nameControl = new FormControl<string>('', Validators.required);
  }

  ngOnInit(): void {
    this.chatService.getChats().subscribe((chats: Chat[]) => {
      this.chats = chats;
      this.cd.detectChanges();
    });
  }


  createChat(): void {
    this.chatService.createChat(this.nameControl.value as string).subscribe((chat: Chat) => {
      this.nameControl.reset();
      this.chats.push(chat);

      this.toastrService.success('Чат успішно створено', 'Успіх', {
        status: 'success', // Green color
      });

      this.cd.detectChanges();
    },

      (err: HttpErrorResponse) => {
        this.toastrService.danger(err.error, 'Помилка', {  // TODO not displaying correctly
          status: 'danger', // Red color
        });
      }

    );
  }

  onChatPressed(id: number): void {
    this.router.navigate([`/main/chat-room/${id}`]);
  }
}
