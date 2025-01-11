import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService {

  protected baseUrl = environment.backendUrl;
  protected abstract ENDPOINT: string;

  protected get url(): string {
    return this.baseUrl + this.ENDPOINT;
  }

  constructor(public http: HttpClient) {
  }

}
