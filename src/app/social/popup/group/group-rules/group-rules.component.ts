import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from 'src/app/services/groups.service';
import { CreateGroupComponent } from '../create-group/create-group.component';

@Component({
  selector: 'app-group-rules',
  templateUrl: './group-rules.component.html',
  styleUrls: ['./group-rules.component.scss'],
})
export class GroupRulesComponent implements OnInit {
  groupId: number = -1;
  groupForm: FormGroup;
  constructor(
    private toastr: ToastrService,
    private groupService: GroupService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.groupId = data.groupId;
  }

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.groupForm = this.fb.group({
      id: [this.data.data ? this.data.data.id : 0],
      groupId: [this.groupId],
      description: [
        this.data.data ? this.data.data.description : '',
        Validators.compose([Validators.required]),
      ],
      title: [
        this.data.data ? this.data.data.title : '',
        Validators.compose([Validators.required]),
      ],
    });
  }
  async saveGroupRules() {
    try {
      if (this.groupForm.value.id <= 0) {
        const res = await this.groupService.addGroupRules(this.groupForm.value);
        this.toastr.success('Created Successfully');
        this.dialogRef.close('saved');
      } else {
        const res = await this.groupService.updateGroupRules(
          this.groupForm.value
        );
        this.toastr.success('Updated Successfully');
        this.dialogRef.close('saved');
      }
    } catch (error) {
      this.toastr.error(error.error.meta.message);
    }
  }
}
