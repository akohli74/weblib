import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type UiCommand =
  | { type: 'REFRESH_BOOKS' }
  | { type: 'OPEN_CREATE_BOOK' }
  | { type: 'SET_FILTER'; value: string };

@Injectable({ providedIn: 'root' })
export class EventingService {
  private readonly _commands = new Subject<UiCommand>();
  readonly commands$ = this._commands.asObservable();

  emit(cmd: UiCommand) {
    this._commands.next(cmd);
  }
}