import { HobbiesService } from './../../../services/hobbies.service';
import { UserService } from './../../../services/user.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CityComponent } from '../../popup/profile/city/city.component';
import { CollegeComponent } from '../../popup/profile/college/college.component';
import { DOBComponent } from '../../popup/profile/dob/dob.component';
import { EmailComponent } from '../../popup/profile/email/email.component';
import { GenderComponent } from '../../popup/profile/gender/gender.component';
import { HobbiesComponent } from '../../popup/profile/hobbies/hobbies.component';
import { NumberComponent } from '../../popup/profile/number/number.component';
import { RelationshipComponent } from '../../popup/profile/relationship/relationship.component';
import { SchoolComponent } from '../../popup/profile/school/school.component';
import { WorkComponent } from '../../popup/profile/work/work.component';
import { WorkEducationService } from 'src/app/services/work-educations.service';
import { SocialService } from 'src/app/services/social.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PERMISSIONS, PermissionType } from '../../../helpers/permission.enum';
import { FriendService } from 'src/app/services/friend.service';
@Component({
  selector: 'app-about-privacy-data',
  template: ` <span *ngIf="checkPermission()"> {{ data }}</span> `,
})
export class AboutPrivacyDataComponent implements OnInit, OnDestroy {
  @Input() data: any = '';
  @Input() permissions: any = [];
  @Input() permissionType: any = -1;
  @Input() checkIsFriend: boolean = false;

  permissionTypes: any = PermissionType;
  constructor() {}
  ngOnInit(): void {}
  ngOnDestroy(): void {}
  checkPermission() {
    const dat = this.permissions.find(
      (x) => x.permission == this.permissionType
    );
    if (!dat) {
      return true;
    }
    if (dat.permissionType === 1) {
      return true;
    } else if (dat.permissionType === 3) {
      return false;
    } else {
      if (this.checkIsFriend) {
        return true;
      } else {
        return false;
      }
    }
  }
}
