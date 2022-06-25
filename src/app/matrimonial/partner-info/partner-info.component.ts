import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-partner-info',
  templateUrl: './partner-info.component.html',
  styleUrls: ['./partner-info.component.scss'],
})
export class PartnerInfoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  scroll($element): void {
    console.log($element);
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }
}
