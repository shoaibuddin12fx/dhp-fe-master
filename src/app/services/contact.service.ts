import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private showContactPopup$: Subject<boolean> = new BehaviorSubject(false);
  constructor() {}

  toggleContactPopup(value: boolean) {
    this.showContactPopup$.next(value);
  }

  contactPopupObservable() {
    return this.showContactPopup$.asObservable();
  }
}
