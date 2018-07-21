import { ActionSheet } from 'ionic-angular/es2015';
import { Component, AfterViewInit, ViewChild, TemplateRef, OnChanges, OnInit, AfterContentInit } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { TriangulatorPage } from './triangulator';
import { CommonService } from '../../app/commonService';
import { Camera, CameraOptions, CameraPopoverOptions } from '@ionic-native/camera';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Platform, ActionSheetController, MenuController } from 'ionic-angular';
import { CameraViewPage } from '../camera-view/camera-view';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { StatusBar } from '@ionic-native/status-bar';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Instagram } from '@ionic-native/instagram';

import jquery from 'jquery';
declare var $: jquery;
/**
 * A very first page of app to perform buisness logic.
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit, OnInit {

  process: any;
  original: any;

  @ViewChild("canvas") delaunay: TemplateRef<any>;
  elem: any;

  yapeLaplacian: number = 50;
  yapeMineigen: number = 35;
  algorithm: String = 'yape06';
  radius: number = 2;
  threshold: number = 15;
  size: number = 200;
  rotation: string = "";
  base64Image: any = 'data:image/jpeg;base64,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';
  onShareButtonClicked: boolean = false;
  onShareViaInstagramButtonClicked: boolean = false;
  deviceAndroid = this.platform.is('android') ? true : false;

  constructor(public navCtrl: NavController, public commonService: CommonService, private camera: Camera, private socialSharing: SocialSharing, private diagnostic: Diagnostic, public alertController: AlertController, private actionSheetCtrl: ActionSheetController, public navParams: NavParams, private base64ToGallery: Base64ToGallery, public photoLibrary: PhotoLibrary, public toastController: ToastController, public platform: Platform, public statusBar: StatusBar, public ga: GoogleAnalytics, private instagram: Instagram) {
    this.commonService.getSize.subscribe(res => {
      this.size = res;
      this.manipulateImage();
    });

    this.commonService.getAlgorithm.subscribe(res => {
      this.algorithm = res;
      console.log(this.algorithm);
      this.manipulateImage();
    });
  }

  /**
   * triangulate image
   */
  getImageAndTriangulateit() {
    const tempImage = this.navParams.get('base64Image');

    if (tempImage) {
      this.base64Image = tempImage;
      this.manipulateImage();
    } else {
      const alert = this.alertController.create({
        title: 'Alert',
        subTitle: 'base64Image is blank',
        buttons: ['Dismiss']
      });
      alert.present();
      this.manipulateImage();
    }
  }

  /**
   * Image save in gallery
   */
  saveImageInGallery1() {

    let base64Image: any;
    base64Image = document.getElementById('delaunay');

    this.base64ToGallery.base64ToGallery(base64Image.toDataURL(), { prefix: 'trinaglify_img' + new Date().getTime(), mediaScanner: true }).then(
      res => {
        this.toastController.create({
          message: 'Image is saved in gallery',
          duration: 3000,
          position: 'top',
        }).present();
      },
      err => {
        this.toastController.create({
          message: 'Try again',
          duration: 3000,
          position: 'top'
        }).present();
      }
    );
  }

  /**
  * Image save in gallery using "Trianglify" folder name
  */
  saveImageInGallery() {

    let base64Image: any;
    base64Image = document.getElementById('delaunay');

    this.photoLibrary.saveImage(base64Image.toDataURL(), "Trianglify").then(
      res => {
        this.toastController.create({
          message: 'Image is saved in gallery',
          duration: 3000,
          position: 'top',
        }).present();
      },
      err => {
        this.toastController.create({
          message: 'Try again',
          duration: 3000,
          position: 'top'
        }).present();
      }
    );
  }

  /**
   * Share the converted image
   */
  onShare() {
    // let base64Image = this.delaunay.elementRef.nativeElement.toDataURL();
    this.onShareButtonClicked = true;
    let base64Image: any;
    base64Image = document.getElementById('delaunay');
    this.socialSharing.share('', '', base64Image.toDataURL(), null).then(() => {
      this.onShareButtonClicked = false;
    }, () => {
      this.onShareButtonClicked = false;
    });
    console.log(base64Image.toDataURL());
  }

  /**
   * Share the converted image on instagram
   */
  onShareViaInstagram() {
    // let base64Image = this.delaunay.elementRef.nativeElement.toDataURL();
    this.onShareViaInstagramButtonClicked = true;
    let base64Image: any;
    base64Image = document.getElementById('delaunay');

    this.instagram.isInstalled().then((e) => {

      this.base64ToGallery.base64ToGallery(base64Image.toDataURL(), { prefix: 'trinaglify_img' + new Date().getTime(), mediaScanner: true }).then(
        res => {
          this.instagram.shareAsset(base64Image.toDataURL())
          .then(() => {
            this.onShareViaInstagramButtonClicked = false;
          }, () => {
            this.onShareViaInstagramButtonClicked = false;
          });
        },
        err => {
          this.toastController.create({
            message: 'Try again',
            duration: 3000,
            position: 'top'
          }).present();
        }
      );
    }, () => {

      this.onShareViaInstagramButtonClicked = false;
      
      const alert = this.alertController.create({
        title: 'Alert',
        subTitle: 'Istagram is not Installed',
        buttons: ['Dismiss']
      });
      alert.present();
    })

  }

  /**
   * to rotate the image in left, right and normal direction respectively.
   */
  onRotate() {
    this.rotation = this.rotation === "" ? "rotate-left" : this.rotation === "rotate-left" ? "rotate-right" : "";
  }

  /**
  * defining back option in displaying image screen
   */
  onBack() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    this.ga.trackView("home").then(() => console.log('page tracked'), () => console.log('page is not tracked'));
    if (this.platform.is("ios")) {
      this.platform.ready().then(() => {
        this.platform.is('android') ? this.statusBar.show() : this.statusBar.show();
        this.statusBar.styleLightContent();
        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString("#1e1e1e");
      });
    }
  }

  ionViewWillLeave() {
    this.platform.is('android') ? this.statusBar.show() : this.statusBar.hide();
  }

  /**
   * Convert the image normal into triangulated through 
   * jsfeat : to get corners
   * delanuay to get those corners back in image with rgb colors
   */
  manipulateImage() {
    //------------------------------JsFeat----------------------------------------
    this.elem = document.getElementById('delaunay');

    // elem = document.createElement('canvas');
    // document.body.appendChild(elem);
    this.original = {
      image: this.base64Image,
      algorithm: this.algorithm,

      yapeLaplacian: this.yapeLaplacian,
      yapeMineigen: this.yapeMineigen,

      yapeRadius: this.radius,

      fastTreshold: this.threshold,

      rawImage: null,

      size: this.size
    };

    this.process = this.original;

    try {
      new TriangulatorPage().triangulator(this.elem, this.original);
    } catch (error) {
      console.log(" error when trianglify an image on resume pls check and fix it here", error);
    }
  }

  ngOnInit() {
    // console.log('permissions done');
    // this.onPicImage();
  }

  ngAfterViewInit() {
    // camera options (Size and location). In the following example, the preview uses the rear camera and display the preview in the back of the webview

    this.getImageAndTriangulateit();

  }
}
