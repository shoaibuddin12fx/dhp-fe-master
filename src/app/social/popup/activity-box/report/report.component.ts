import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from 'src/app/services/groups.service';
import { SocialService } from 'src/app/services/social.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  reportObj = {
    groupId: null,
    userId: null,
    postId: null,
    reportType: '',
    topic: '',
    details: '',
    link: '',
  };
  isSubmitted = false;
  constructor(
    public dialogRef: MatDialogRef<ReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupService: GroupService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.reportObj.groupId = this.data.groupId;
    this.reportObj.userId = this.data.userId;
    this.reportObj.postId = this.data.postId;
  }

  setReportType(reportType) {
    if (reportType == '') {
      this.toastr.error('Please select any reason');
      return;
    }
    this.reportObj.reportType = reportType;
  }
  async reportContent() {
    try {
      this.isSubmitted = true;
      if (this.reportObj.reportType === 'Something else') {
        if (this.reportObj.topic === '' || this.reportObj.details === '') {
          return;
        }
      } else if (
        this.reportObj.reportType === 'Copyright issue or Copyrighted Material'
      ) {
        if (this.reportObj.link === '') {
          return;
        }
      }
      const res: any = await this.groupService
        .reportContent(this.reportObj)
        .then();
      if (res.data) {
        this.toastr.success('Reported Sucessfully!');
      } else {
        this.toastr.error('Something Went wrong');
      }

      this.dialogRef.close();
    } catch (error) {
      this.dialogRef.close();
      this.toastr.error(error.error.meta.message);
    }
  }
}
