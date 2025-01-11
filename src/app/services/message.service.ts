import {Injectable} from "@angular/core";
import {BaseApiService} from "./base-api.service";
import {Observable} from "rxjs";
import {Message, MessageType} from "../models/message";

@Injectable({
  providedIn: 'root'
})

export class MessageService extends BaseApiService {

  protected readonly ENDPOINT =  "/messages";

  sendMessage(content: string, messageType: MessageType, chatId: number): Observable<Message> {
    return this.http.post<Message>(this.url, {content, messageType, chatId});
  }
}
