import {Injectable} from "@angular/core";
import {BaseApiService} from "./base-api.service";
import {Observable} from "rxjs";
import {User} from "../models/user.model";
import {Page} from "../models/page";
import {UserChatParticipant} from "../models/user-chat-participant";

@Injectable({
  providedIn: 'root'
})

export class UserService extends BaseApiService {

  protected readonly ENDPOINT =  "/users";

  getUsers$(): Observable<Page> {
    return this.http.get<Page>(this.url);
  }

  updateUser$( user: User ): Observable<User> {
    return this.http.put<any>(this.url + "/" + user.id, user);
  }

  createUser$( user: User ): Observable<User> {
    return this.http.post<any>(this.url + "/registration", user);
  }

  deleteUser$(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getUsersOutOfChat$(chatId: number): Observable<UserChatParticipant[]> {
    return this.http.get<UserChatParticipant[]>(`${this.url}/out-of-chat/${chatId}`);
  }
}
