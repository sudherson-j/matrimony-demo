import {
  Component,
  ElementRef,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import * as EventEmitter from 'events';
import { WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-add-photos',
  templateUrl: './add-photos.component.html',
  styleUrls: ['./add-photos.component.scss'],
})
export class AddPhotosComponent implements OnInit {
  takePhoto: any;
  images: any = [];
  uploadPhotoDialog: any;
  @ViewChild(TemplateRef)
  dialogTemplate!: TemplateRef<any>;
  @ViewChild('uploadPhoto', { static: true })
  uploadPhoto!: TemplateRef<any>;

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private imageCompress: NgxImageCompressService,
    private localStorageService: LocalStorageService,
    private _bottomSheetRef: MatBottomSheetRef<AddPhotosComponent>
  ) {}

  webcamImage: any;
  @Output()
  public pictureTaken = new EventEmitter();
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = true;
  public deviceId: string | undefined;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  items: any = [];
  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
    this.items =
      this.localStorageService.getItem('photos') === null
        ? []
        : this.localStorageService.getItem('photos');
    this.localStorageService.watchStorage().subscribe((res) => {
      if (res.key === 'photos') {
        this.items = res.data;
      }
    });
  }
  public triggerSnapshot(): void {
    this.trigger.next();
  }
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
  public handleImage(webcamImage: any): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }
  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  confirm() {
    let photos =
      this.localStorageService.getItem('photos') === null
        ? []
        : this.localStorageService.getItem('photos');
    photos.push({ id: Date.now(), src: this.webcamImage._imageAsDataUrl });
    this.localStorageService.setItem('photos', photos);
    this.takePhoto.close();
  }

  action(item: string): void {
    switch (item) {
      case 'upload':
        if (this.items.length < 6) {
          this.uploadPhotoDialog = this.dialog.open(this.uploadPhoto, {
            width: '500px',
          });
        } else {
          this._snackBar.open(`Maximum 6 photos allowed!`, 'close', {
            duration: 3000,
          });
        }
        break;
      case 'camera':
        if (this.items.length < 6) {
          this.takePhoto = this.dialog.open(this.dialogTemplate, {
            width: '500px',
          });
        } else {
          this._snackBar.open(`Maximum 6 photos allowed!`, 'close', {
            duration: 3000,
          });
        }
        break;
      case 'whatsapp':
        window.open('https://wa.me/919094983918', '_target');
        break;
    }
    this._bottomSheetRef.dismiss();
  }

  @ViewChild('fileInput')
  fileInput!: ElementRef;
  fileAttr = 'Choose Files';
  uploadFileEvt(imgFile: any) {
    this.images = [];
    this.images = [...imgFile.target.files];
    if (
      imgFile.target.files &&
      imgFile.target.files[0] &&
      imgFile.target.files.length <= 6 - this.items.length
    ) {
      this.fileAttr = `${this.images.length} File Added`;
    } else {
      this.fileAttr = 'Choose Files';
      this._snackBar.open(
        `Maximum 6 photos allowed! You can only add ${6 - this.items.length}`,
        'close',
        {
          duration: 3000,
        }
      );
    }
  }

  remove(image: any): void {
    const index = this.images.indexOf(image);

    if (index >= 0) {
      this.images.splice(index, 1);
    }
    this.fileAttr = `${this.images.length} File Added`;
    if (this.images.length === 0) {
      this.fileAttr = 'Choose Files';
    }
  }

  confirmUpload() {
    this.images.forEach((image: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e: any) => {
        let localUrl = e.target.result;
        this.compressFile(localUrl);
      };
    });
    this.uploadPhotoDialog.close();
  }

  compressFile(image: any) {
    var orientation = -1;
    this.imageCompress
      .compressFile(image, orientation, 50, 50)
      .then((result) => {
        let photos =
          this.localStorageService.getItem('photos') === null
            ? []
            : this.localStorageService.getItem('photos');
        photos.push({ id: Date.now(), src: result });
        this.localStorageService.setItem('photos', photos);
      });
  }
}
