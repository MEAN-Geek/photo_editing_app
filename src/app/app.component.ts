import { Component } from '@angular/core';
import { Platform, ActionSheetController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CommonService } from './commonService';
import { HomePage } from '../pages/home/home';
import { CameraViewPage } from '../pages/camera-view/camera-view';
import { Diagnostic } from '@ionic-native/diagnostic';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage:any = HomePage;
  rootPage:any = CameraViewPage;  

  algorithm : string = "yape06";
  size : number = 200;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public commonService : CommonService, public actionSheetCtrl: ActionSheetController, public menuController : MenuController, public ga : GoogleAnalytics) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.ga.startTrackerWithId('UA-109219204-1')
        .then(()=>{
            console.log('getting connected');
            this.ga.trackView('cameraPreview');
        },()=>{
            console.log('error in promise');
        }).catch((e)=> console.log('here is exception '+e));
    });
  }

  /**
   * send the response on common service to update pages data
   */
  manipulateContent(){
    this.commonService.manipulate({size : this.size, algorithm : this.algorithm});
  }

  /**
   * Selection of algorithms to convert images in triangulate images
   */
  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'YAPE06',
          role: 'destructive',
          handler: () => {
            this.algorithm = 'yape06';
            this.manipulateContent();
            this.menuController.close();
          }
        },
        {
          text: 'YAPE',
          role: 'destructive',
          handler: () => {
            this.algorithm = 'yape';
            this.manipulateContent();
            this.menuController.close();
          }
        },
        {
          text: 'FAST CORNERS',
          role: 'destructive',
          handler: () => {
            this.algorithm = 'fast';
            this.manipulateContent();
            this.menuController.close();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
 
    actionSheet.present();
  }
}

