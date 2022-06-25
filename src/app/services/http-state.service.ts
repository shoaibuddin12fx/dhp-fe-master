import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpStateService {
  public state = new BehaviorSubject<any>(false);

  constructor() {}
}
