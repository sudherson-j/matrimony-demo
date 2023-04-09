import { Component, OnInit } from '@angular/core';
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from '../shared/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AddPhotosComponent } from '../add-photos/add-photos.component';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {
  items: any = [];

  constructor(
    public dialog: MatDialog,
    private _bottomSheet: MatBottomSheet,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private localStorageService: LocalStorageService
  ) {
    this.iconRegistry.addSvgIcon(
      'whatsapp',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/whatsapp.svg')
    );
  }

  ngOnInit(): void {
    let photos = this.localStorageService.getItem('photos');
    // debugger;
    this.items = photos === null ? [] : photos;
    this.localStorageService.watchStorage().subscribe((res) => {
      if (res.key === 'photos') {
        this.items = res.data;
      }
    });
  }

  openDialog(photo: any): void {
    const message = `Members with multiple photos get better responses. Do you still want to delete
    this photo?`;

    const dialogData = new ConfirmDialogModel('Delete Photo', message);

    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.items = this.items.filter((item: any) => item.id !== photo.id);
        this.localStorageService.setItem('photos', this.items);
      }
    });
  }

  drop(event: CdkDragDrop<{ id: string; src: string }[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }

  addPhotos() {
    this._bottomSheet.open(AddPhotosComponent);
  }
}
