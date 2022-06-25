import { Component, OnInit } from '@angular/core';
import { toUnicode } from 'punycode';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit {
  constructor() {}
  changeState = null;
  isVisible: boolean = false;
  ngOnInit(): void {}
  checkState(event, el) {
    event.preventDefault();
    if (this.changeState && this.changeState === el.value) {
      this.changeState = null;
      this.isVisible = false;
    } else {
      this.changeState = el.value;
      this.isVisible = true;
    }
  }
}
