import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private slimLoader$: Subject<boolean> = new BehaviorSubject(false);

  constructor(private spinner: NgxSpinnerService) {}

  PresentLoading() {
    // this.spinner.show();
  }

  DissmissLoading() {
    this.spinner.hide();
  }

  showSlimLoader() {
    this.slimLoader$.next(true);
  }

  hideSlimLoader() {
    this.slimLoader$.next(false);
  }

  slimLoaderObservable() {
    return this.slimLoader$.asObservable();
  }
}
