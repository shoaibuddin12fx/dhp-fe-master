import { HobbiesService } from './../../../services/hobbies.service';
import { UserService } from './../../../services/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit, OnDestroy {
  currentUser: any;
  userData: any;
  genderData: any;
  workData: any[] = [];
  yearArr: any[] = [];
  permissionData = [];
  hobbiesData: any[] = [];
  description: any;
  userBio: any = '';
  profileId: any;
  isMyProfile = true;
  permissionTypes: any = PermissionType;
  profileInformation: FormGroup;
  profileIsFriend: boolean = false;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userService: UserService,
    private workEducationService: WorkEducationService,
    private hobbyService: HobbiesService,
    private socialService: SocialService,
    private friendService: FriendService,
    private route: ActivatedRoute,
    private toastService: ToastrService
  ) {
    this.profileId = this.route.snapshot.params['id'];
  }
  ngOnInit(): void {
    this.socialService.isProfile.next({
      isProfile: true,
      profileId: this.profileId,
    });
    var d = new Date();
    var currentYear = d.getFullYear();
    this.yearArr = [];
    for (let i = currentYear; i >= currentYear - 29; i--) {
      this.yearArr.push(i);
    }
    this.currentUser = JSON.parse(localStorage.getItem('User'));
    this.isMyProfile = +this.currentUser.id === +this.profileId ? true : false;
    if (!this.isMyProfile) {
      this.friendService
        .checkIsFriends(this.currentUser.id, +this.profileId)
        .toPromise()
        .then((res: any) => {
          if (+res.data[0].count > 0) {
            this.profileIsFriend = true;
          } else {
            this.profileIsFriend = false;
          }
        });
    }
    this.getUser(this.profileId);
    this.getUserPermission(+this.profileId);
  }
  ngOnDestroy(): void {}

  getUser(id) {
    this.userService.getAboutData(id).then((x: any) => {
      debugger;
      this.userData = x.data.user;
      this.userBio = x.data.user.bio;
      this.description = x.data.user.description;
      this.genderData = x.data.gender;
      this.workData = x.data.work;
      this.hobbiesData = x.data.hobby;
      this.userService.updateUserData();
    });
  }

  addAboutData(data) {
    this.userService.addAboutData(data).then((x) => {
      this.getUser(this.profileId);
    });
  }

  saveDescription() {
    const data = {
      key: 'description',
      value: this.description,
      id: this.profileId,
    };
    this.addAboutData(data);
    this.userService.updateUserData();
  }

  createForm() {
    this.profileInformation = this.fb.group({
      Hobby: ['', Validators.compose([Validators.required])],
      Gender: ['', Validators.compose([Validators.required])],
      DOB: ['', Validators.compose([Validators.required])],
      Relationship: ['', Validators.compose([Validators.required])],
      Work: ['', Validators.compose([Validators.required])],
      College: ['', Validators.compose([Validators.required])],
      School: ['', Validators.compose([Validators.required])],
      Address: ['', Validators.compose([Validators.required])],
      Phone: ['', Validators.compose([Validators.required])],
      Email: ['', Validators.compose([Validators.required])],
    });
    this.profileInformation;
  }
  openHobbyDialog(key, hobby): void {
    const dialogRef = this.dialog.open(HobbiesComponent, {
      width: '35%',
      height: '35vh',
      disableClose: true,
      data: { key: key, hobby: hobby },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined && result !== 'delete') {
        const data = {
          // key: key,
          name: result,
          userId: this.profileId,
        };
        if (hobby.id) {
          this.hobbyService.updateHobbiesData(hobby.id, data).then((x) => {
            this.getUser(this.profileId);
          });
        } else {
          this.hobbyService.addHobbiesData(data).then((x) => {
            this.getUser(this.profileId);
          });
        }
      } else {
        this.getUser(this.profileId);
      }
    });
  }
  openGenderDialog(key, gender): void {
    const DialogRef = this.dialog.open(GenderComponent, {
      width: '35%',
      height: '35vh',
      disableClose: true,
      data: { key: key, gender: gender },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        const data = {
          key: key,
          value: result,
          id: this.profileId,
        };
        this.addAboutData(data);
      }
    });
  }
  openDOBDialog(key, dateOfBirth) {
    const DialogRef = this.dialog.open(DOBComponent, {
      width: '35%',
      height: '35vh',
      disableClose: true,
      data: { key: key, dateOfBirth: dateOfBirth },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        const data = {
          key: key,
          value: result,
          id: this.profileId,
        };
        this.addAboutData(data);
      }
    });
  }
  openRelationDialog(key, relationship) {
    const DialogRef = this.dialog.open(RelationshipComponent, {
      width: '35%',
      height: '35vh',
      disableClose: true,
      data: { key: key, relationship: relationship },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        const data = {
          key: key,
          value: result,
          id: this.profileId,
        };
        this.addAboutData(data);
      }
    });
  }
  openWorkDialog(key, work, i?) {
    const DialogRef = this.dialog.open(WorkComponent, {
      width: '35%',
      height: '65vh',
      disableClose: true,
      data: { key: key, yearArr: this.yearArr, work: work },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        const data = {
          name: result.name,
          position: result.position,
          degree: result.degree,
          type: key,
          fromDate: result.fromDate?.toString(),
          toDate: result.toDate?.toString(),
          isCurrentlyEmployed: result.isCurrentlyEmployed,
          userId: this.profileId,
        };
        if (work.id) {
          this.workEducationService.updateWorkData(work.id, data).then((x) => {
            this.getUser(this.profileId);
          });
        } else {
          this.workEducationService.addWorkData(data).then((x) => {
            this.getUser(this.profileId);
          });
        }
      }
    });
  }
  openCollegeDialog(key, college) {
    const DialogRef = this.dialog.open(CollegeComponent, {
      width: '35%',
      height: '65vh',
      disableClose: true,
      data: { key: key, yearArr: this.yearArr, college: college },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        const data = {
          name: result.name,
          position: result.position,
          degree: result.degree,
          type: key,
          fromDate: result.fromDate?.toString(),
          toDate: result.toDate?.toString(),
          isCurrentlyEmployed: result.isCurrentlyEmployed,
          userId: this.profileId,
        };
        if (college.id) {
          this.workEducationService
            .updateWorkData(college.id, data)
            .then((x) => {
              this.getUser(this.profileId);
            });
        } else {
          this.workEducationService.addWorkData(data).then((x) => {
            this.getUser(this.profileId);
          });
        }
      }
    });
  }
  openSchoolDialog(key, school) {
    const DialogRef = this.dialog.open(SchoolComponent, {
      width: '35%',
      height: '45vh',
      disableClose: true,
      data: { key: key, yearArr: this.yearArr, school: school },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        const data = {
          name: result.name,
          position: result.position,
          degree: result.degree,
          type: key,
          fromDate: result.fromDate?.toString(),
          toDate: result.toDate?.toString(),
          isCurrentlyEmployed: result.isCurrentlyEmployed,
          userId: this.profileId,
        };
        if (school.id) {
          this.workEducationService
            .updateWorkData(school.id, data)
            .then((x) => {
              this.getUser(this.profileId);
            });
        } else {
          this.workEducationService.addWorkData(data).then((x) => {
            this.getUser(this.profileId);
          });
        }
      }
    });
  }
  openCityDialog(key, address) {
    const DialogRef = this.dialog.open(CityComponent, {
      width: '35%',
      height: '35vh',
      disableClose: true,
      data: { key: key, address: address },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        const data = {
          key: key,
          value: result,
          id: this.profileId,
        };
        this.addAboutData(data);
      }
    });
  }
  openNumberDialog(key, contactNo) {
    const DialogRef = this.dialog.open(NumberComponent, {
      width: '35%',
      height: '52vh',
      disableClose: true,
      data: { key: key, contactNo: contactNo },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        const data = {
          key: key,
          value: result,
          id: this.profileId,
        };
        this.addAboutData(data);
      }
    });
  }
  openMailDialog(key, email) {
    const DialogRef = this.dialog.open(EmailComponent, {
      width: '35%',
      height: '52vh',
      disableClose: true,
      data: { key: key, email: email },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        const data = {
          key: key,
          value: result,
          id: this.profileId,
        };
        this.addAboutData(data);
      }
    });
  }

  filterWorkOfType(type) {
    return this.workData.filter((x) => x.type == type);
  }
  async saveUserPermission(permission, permissionType) {
    const req = {
      userId: this.currentUser.id,
      permission: permission,
      permissionType: permissionType,
      id:
        this.permissionData.find(
          (x) => x.userId == this.currentUser.id && x.permission == permission
        )?.id || 0,
    };
    const res = await this.userService.savePermission(req);
    this.getUserPermission(this.currentUser.id);

    this.userService.updateUserData();
    this.toastService.success('Updated Successfully!.');
  }
  get getPermission() {
    const data = PERMISSIONS;
    return data;
  }
  getUserPermission(userId: number) {
    this.userService.getUserPermission(userId).then((x: any) => {
      this.permissionData = x.data;
    });
  }

  checkPermission(permissionType: number) {
    if (this.isMyProfile) {
      return true;
    }
    const dat = this.permissionData.find((x) => x.permission == permissionType);
    if (!dat) {
      return true;
    }
    if (dat.permissionType === 1) {
      return true;
    } else if (dat.permissionType === 3) {
      return false;
    } else {
      if (this.profileIsFriend) {
        return true;
      } else {
        return false;
      }
    }
  }
}
