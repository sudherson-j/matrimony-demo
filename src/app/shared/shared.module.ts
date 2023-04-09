import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { WebcamModule } from 'ngx-webcam';

import { ConfirmComponent } from './confirm/confirm.component';

const THIRD_MODULES = [
  FormsModule,
  ReactiveFormsModule,
  DragDropModule,
  MatChipsModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatToolbarModule,
  MatTooltipModule,
  MatSnackBarModule,
  WebcamModule,
  MatNativeDateModule,
  MatRippleModule,
];

@NgModule({
  exports: [CommonModule, ...THIRD_MODULES],
  imports: [RouterModule, CommonModule, ...THIRD_MODULES],
  declarations: [ConfirmComponent],
  providers: [],
})
export class SharedModule {}
