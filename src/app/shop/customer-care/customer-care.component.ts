import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-care',
  templateUrl: './customer-care.component.html',
  styleUrls: ['./customer-care.component.scss'],
})
export class CustomerCareComponent implements OnInit {
  shopType: any;
  constructor(private route: ActivatedRoute) {
    this.shopType = this.route.snapshot.params['type'];
  }

  ngOnInit(): void {}
}
