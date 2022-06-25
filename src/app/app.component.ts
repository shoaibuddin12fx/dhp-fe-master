import {
  AfterContentChecked,
  AfterViewChecked,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FirebaseService } from './services/firebase.service';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'tes';
  showSlimLoader$: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.setSlimLoaderObservable();
    this.firebaseService.initFirebase();
  }

  setSlimLoaderObservable() {
    this.showSlimLoader$ = this.loaderService
      .slimLoaderObservable()
      .pipe(delay(100));
  }
}
