import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UnreadMessagesItem } from '../interfaces/shared.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatCountService {
  private chatCount$ = new BehaviorSubject(0);
  constructor() {}

  setCount(unReadMessages: UnreadMessagesItem[]) {
    const count = unReadMessages.reduce((total, message) => {
      total += +!!(message?.count || 0);
      return total;
    }, 0);
    this.chatCount$.next(count);
  }

  getChatCount() {
    return this.chatCount$.asObservable();
  }
}
