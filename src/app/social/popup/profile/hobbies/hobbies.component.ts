import { HobbiesService } from './../../../../services/hobbies.service';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-hobbies',
  templateUrl: './hobbies.component.html',
  styleUrls: ['./hobbies.component.scss'],
})
export class HobbiesComponent implements OnInit {
  hobby: any;
  isNew = true;
  constructor(
    public dialogRef: MatDialogRef<HobbiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private hobbiesService: HobbiesService
  ) {}
  ngOnInit(): void {
    if (this.data && this.data.hobby?.name) {
      this.hobby = this.data.hobby?.name;
      this.isNew = false;
    }
  }
  add(): void {
    this.dialogRef.close(this.hobby);
  }

  async remove() {
    await this.hobbiesService.deleteHobbiesData(this.data.hobby?.id);
    this.dialogRef.close('delete');
  }
}
