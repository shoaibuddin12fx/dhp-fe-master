import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-like-post',
  templateUrl: './like-post.component.html',
  styleUrls: ['./like-post.component.scss'],
})
export class LikePostComponent implements OnInit {
  users: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.users = data.likeUsers;
  }

  ngOnInit(): void {}
}
