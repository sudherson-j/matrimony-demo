import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PhotosComponent } from './photos/photos.component';
import { SharedModule } from './shared/shared.module';
import { AddPhotosComponent } from './add-photos/add-photos.component';
import { TakePhotoComponent } from './take-photo/take-photo.component';

import { NgxImageCompressService } from 'ngx-image-compress';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    PhotosComponent,
    AddPhotosComponent,
    TakePhotoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
  ],
  providers: [NgxImageCompressService],
  bootstrap: [AppComponent],
})
export class AppModule {}
