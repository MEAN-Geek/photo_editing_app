/**
 * 
 * This class has not used any where it is all about test
 */
import { CommonService } from './../../app/commonService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Camera, CameraOptions, CameraPopoverOptions } from '@ionic-native/camera';
import { CameraViewPageInterface } from './camera-view-interface';
import { DomSanitizer } from '@angular/platform-browser';
import { StatusBar } from '@ionic-native/status-bar';

export class CameraColorEffectMono {

  isFlashMode: boolean = false;
  loadingImage: boolean = false;
  clickPhoto: boolean = false;
  colorEffect: any = ['none', 'mono', 'negative', 'posterize', 'sepia'];
  colorEffectObj : any = [new CameraPreview(), new CameraPreview(), new CameraPreview(), new CameraPreview(), new CameraPreview()];
  colorTypes: boolean = false;
  device: boolean = this.platform.is('android') ? true : false;
  footerHeight : number = 44;
  headerHeight : number = 44;

  constructor(public navCtrl: NavController, public navParams: NavParams, private cameraPreview: CameraPreview, private diagnostic: Diagnostic, public alertController: AlertController, private camera: Camera, private commonService: CommonService, public platform: Platform, public sanitizer: DomSanitizer, public cameraCtr : CameraPreview, public statusBar : StatusBar) {
    
  }

  onPressCamera() {
    let footerHeight = document.getElementById('cameraFooter').offsetHeight;
    let headerHeight = document.getElementById('cameraHeader').offsetHeight;

    this.footerHeight = footerHeight;
    this.headerHeight = headerHeight;

    console.log('console.log', headerHeight);
    let options = {
      x: 5,
      y: (headerHeight + 5),
      width: Math.floor((window.innerWidth*45)%100),
      height: Math.floor((window.innerWidth*45)%100),
      camera: 'rear',
      tapPhoto: false,
      previewDrag: false,
      tapFocus: true,
      toBack: false,
      alpha: 1
    };

    this.platform.ready().then(() => {

      this.diagnostic.isCameraAuthorized().then((authorized) => {
        if (authorized) {
          
          this.cameraPreview.startCamera(options);
          this.cameraPreview.setColorEffect('mono');              
          this.cameraPreview.setFocusMode(this.cameraPreview.EXPOSURE_MODE.AUTO);
        }
        else {
          this.diagnostic.requestCameraAuthorization().then((status) => {
            if (status == this.diagnostic.permissionStatus.GRANTED) {
              
              this.cameraPreview.startCamera(options);
              this.cameraPreview.setColorEffect('mono');              
              this.cameraPreview.setFocusMode(this.cameraPreview.EXPOSURE_MODE.AUTO);
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


}
