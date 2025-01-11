import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private readonly _loading$: BehaviorSubject<boolean>;
  public readonly loading$: Observable<boolean>

  constructor() {
    this._loading$ = new BehaviorSubject<boolean>(false);
    this.loading$ = this._loading$.asObservable();
  }

  public show(): void {
    this._loading$.next(true);
  }

  public hide(): void {
    this._loading$.next(false);
  }
}
