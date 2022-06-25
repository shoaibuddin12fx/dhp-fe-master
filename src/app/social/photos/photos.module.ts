import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotosRoutingModule } from './photos-routing.module';
import { SinglePageComponent } from './single-page/single-page.component';
import { HomeComponent } from './home/home.component';
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
  declarations: [SinglePageComponent, HomeComponent],
  imports: [CommonModule, PhotosRoutingModule, MatMenuModule],
})
export class PhotosModule {}
