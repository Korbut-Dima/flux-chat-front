import {Injectable} from "@angular/core";
import {BaseApiService} from "./base-api.service";
import {Observable} from "rxjs";
import {Chat} from "../models/chat";

@Injectable({
  providedIn: 'root'
})

export class ChatService extends BaseApiService {

  protected readonly ENDPOINT =  "/chats";

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(this.url);
  }

  createChat(name: string): Observable<Chat> {
    return this.http.post<Chat>(this.url, {name});
  }

  getChatById(id: number): Observable<Chat> {
    return this.http.get<Chat>(this.url + `/${id}`);
  }

  addToChat(id: number, participantIds: number[]): Observable<Chat> {
    return this.http.post<Chat>(this.url + `/${id}/add`, {participantIds});
  }
}
