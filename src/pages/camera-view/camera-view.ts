import { HomePage } from './../home/home';
import { CameraColorEffectMono } from './camera-color-effect-mono';
import { CommonService } from './../../app/commonService';
import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, LoadingController } from 'ionic-angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Camera, CameraOptions, CameraPopoverOptions } from '@ionic-native/camera';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { CameraViewPageInterface } from './camera-view-interface';
import { DomSanitizer } from '@angular/platform-browser';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@IonicPage()
@Component({
  selector: 'page-camera-view',
  templateUrl: 'camera-view.html',
})
export class CameraViewPage {

  // imageUrl: any = "assets/loader.gif";
  imageUrl: any;
  isFlashMode: boolean = false;
  loadingImage: boolean = false;
  clickPhoto: boolean = false;

  colorEffect: any = ['none', 'mono', 'negative', 'posterize', 'sepia'];
  colorEffectImageWidth = Math.floor(window.innerWidth * 48 / 100);
  colorEffectObj: any = [new CameraPreview(), new CameraPreview(), new CameraPreview(), new CameraPreview(), new CameraPreview()];
  colorTypes: boolean = false;
  device: boolean = this.platform.is('android') ? true : false;
  iosDevice: boolean = this.platform.is('ios') ? true : false;
  footerHeight: number = 44;
  headerHeight: number = 44;
  takenImage: boolean = false;
  takenImageSrc: any = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHMArQMBIgACEQEDEQH/xAAWAAEBAQAAAAAAAAAAAAAAAAAAAQf/xAAXEAEBAQEAAAAAAAAAAAAAAAAAAUER/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AMOFqAAoIAACggAAoCAAAAAAAAAAAAAAAoIAACgioAqKAgAKgAAQFEWAVAAVAAAAFBAUEFQFRUACqCCoC4kFBFRQQAAAAAAUBFAEBQEUBFRQEUBBUBQQFQAFQAABUAFE6AogAogKip0FQAFQ6CooCAAAAAAAAEMAAAVFQAAAAAAAAAVAAUEFQBUAAxYCCgAAIoAhABUUAAAQAKAAAAAAsQBUAFQAFAEUAEgAKAP/2Q==";
  takenImageWidth : number =  0;
  takenImageHeight : number = 0;

  mono: CameraPreview = new CameraPreview();
  negative: CameraPreview = new CameraPreview();

  constructor(public navCtrl: NavController, public navParams: NavParams, private cameraPreview: CameraPreview, private diagnostic: Diagnostic, public alertController: AlertController, private camera: Camera, private photoLibrary: PhotoLibrary, private commonService: CommonService, public platform: Platform, public sanitizer: DomSanitizer, public cameraCtr: CameraPreview, public statusBar: StatusBar, public changeDetectorRef: ChangeDetectorRef, public loadingCtrl: LoadingController, private splashScreen: SplashScreen, public ga : GoogleAnalytics) {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.platform.is('android') ? this.statusBar.show() : this.statusBar.hide();
    });
    this.mostRecentImageIs();

  }

  /**
   * Open camera on app start
   */
  onPressCamera() {
    let footerHeight = document.getElementById('cameraFooter').offsetHeight;
    let headerHeight = document.getElementById('cameraHeader').offsetHeight;

    this.footerHeight = footerHeight;
    this.headerHeight = headerHeight;

    console.log('console.log', headerHeight);
    let options = {
      x: 0,
      y: (headerHeight + 5),
      width: window.innerWidth,
      height: window.innerHeight - (headerHeight + footerHeight + 10),
      camera: 'rear',
      tapPhoto: false,
      previewDrag: false,
      toBack: false,
      alpha: 1
    };

    this.platform.ready().then(() => {

      this.diagnostic.isCameraAuthorized().then((authorized) => {
        if (authorized) {
          this.cameraPreview.startCamera(options);
          this.clickPhoto = false;
        }
        else {
          this.diagnostic.requestCameraAuthorization().then((status) => {
            if (status == this.diagnostic.permissionStatus.GRANTED) {

              this.cameraPreview.startCamera(options);
            }
            else {
              console.log('camera will not open');

              if (this.platform.is('android')) {
                this.onPressCamera();
              } else {
                this.alertController.create({
                  title: 'Alert',
                  subTitle: 'Cannot access camera',
                  buttons: ['Dismiss']
                }).present();
              }
            }
          });
        }
      });
    }).catch((err) => {
      console.log('camera open error', err);
    });
  }

  /**
   * Capture image
   */
  takePicture() {
    const scop = this;
    this.clickPhoto = true;

    this.takenImageWidth = window.innerWidth;
    this.takenImageHeight = window.innerHeight - (this.headerHeight + this.footerHeight + 10);

    this.cameraPreview.takePicture({ width: window.innerWidth, height: window.innerHeight - (this.headerHeight + this.footerHeight + 10), quality: 100 }).then(function (base64PictureData) {
      /*
        base64PictureData is base64 encoded jpeg image. Use this data to store to a file or upload.
      */
      
      if (scop.iosDevice) {
        scop.cameraPreview.hide();
        scop.takenImage = true;
        scop.takenImageSrc = 'data:image/jpeg;base64,' + base64PictureData;
      }

      scop.navCtrl.push(HomePage, { method: 'camera', base64Image: 'data:image/jpeg;base64,' + base64PictureData });
      scop.clickPhoto = false;
    });
  }

  /**
   * Rotate camera
   */
  rotateCamera() {
    this.cameraPreview.switchCamera();
  }

  /**
   * Flash mode
   */
  onFocusMode() {
    let tempMode = this.isFlashMode ? this.cameraPreview.FLASH_MODE.OFF : this.cameraPreview.FLASH_MODE.ON;
    this.cameraPreview.setFlashMode(tempMode);
    this.isFlashMode = this.isFlashMode ? false : true;
  }

  /**
   * Set color effects
   * @param data string
   */
  onColorEffect(data: string) {
    this.platform.ready().then(() => {
      this.colorTypes = false;
      this.cameraPreview.show();
      this.device = this.platform.is('android') ? true : false;
      this.cameraPreview.setColorEffect(data);
    });
  }

  openFilterGrid() {
    this.colorTypes = this.colorTypes ? false : true;
    if (this.colorTypes) {
      this.cameraPreview.hide();
      if (this.platform.is('ios')) {
        const loading = this.loadingCtrl.create({
        });

        loading.present();
        setTimeout(() => {
          loading.dismiss();
        }, 3000);
      }
    }
    else {
      this.cameraPreview.show();
    }
  }

  gridFiltersForCamera(x: number, colorEffect: string, cameraCtr) {
    let options = {
      x: 0,
      y: x,
      width: this.headerHeight,
      height: this.headerHeight,
      camera: 'rear',
      tapPhoto: false,
      previewDrag: false,
      toBack: false,
      alpha: 1
    };

    // let cameraCtr = new CameraPreview();

    this.platform.ready().then(() => {
      this.diagnostic.isCameraAuthorized().then((authorized) => {
        if (authorized) {
          cameraCtr.setColorEffect(colorEffect);
          cameraCtr.setFocusMode(this.cameraPreview.EXPOSURE_MODE.AUTO);
          cameraCtr.startCamera(options);
        }
        else {
          this.diagnostic.requestCameraAuthorization().then((status) => {
            if (status == this.diagnostic.permissionStatus.GRANTED) {
              cameraCtr.setColorEffect(colorEffect);
              cameraCtr.setFocusMode(this.cameraPreview.EXPOSURE_MODE.AUTO);
              cameraCtr.startCamera(options);
            }
            else {
              console.log('camera will not open');
              this.alertController.create({
                title: 'Alert',
                subTitle: 'Cannot access camera',
                buttons: ['Dismiss']
              }).present();
            }
          });
        }
      });
    });
  }

  /**
   * Selection from gallery
   */
  onPicImageFromGallery() {

    let cameraPopoverOptions: CameraPopoverOptions = {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight - 200,
      arrowDir: 2
    };

    const options: CameraOptions = {
      quality: 85,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    const scop = this;
    this.camera.getPicture(options).then((imageData) => {
      // scop.navCtrl.push(HomePage,{base64Image : 'data:image/jpeg;base64,' + imageData});
      scop.navCtrl.push(HomePage, { base64Image: 'data:image/jpeg;base64,' + imageData });
      scop.changeDetectorRef.detectChanges();
    }, (err) => {

    });
  }

  /**
   * Pic image for gallery
   */
  mostRecentImageIs() {
    let scop = this;

    this.platform.ready().then(() => {
      this.photoLibrary.requestAuthorization().then(() => {
        this.photoLibrary.getLibrary().subscribe({
          next: library => {
            scop.imageUrl = scop.sanitizer.bypassSecurityTrustResourceUrl(library[0].thumbnailURL);
            scop.changeDetectorRef.detectChanges();
          },
          error: err => { console.log('could not get photos'); },
          complete: () => { console.log('done getting photos'); }
        });
      })
        .catch(err => console.log('permissions weren\'t granted'));
    });
  }

  ionViewDidLoad() {
    //camera ON
    this.onPressCamera();
    console.log('ionViewDidLoad CameraViewPage');
  }

  /**
   * On View did enter
   */
  ionViewDidEnter() {
    this.takenImage = false;
    this.clickPhoto = false;

    this.ga.trackView("cameraPreview").then(()=> console.log('page tracked'), ()=> console.log('page is not tracked'));        
    this.platform.is('android') ? this.statusBar.show() : this.statusBar.hide();    
    // this.cameraPreview.show();
    //camear ON
    this.onPressCamera();
    this.mostRecentImageIs()
    console.log("Looks like I'm about to enter :(");
  }

  ionViewWillLeave() {
    //Off camera
    this.cameraPreview.stopCamera();
    // this.cameraPreview.hide();
    console.log("Looks like I'm about to leave :(");
  }

}
