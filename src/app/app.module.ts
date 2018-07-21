import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CameraViewPage } from '../pages/camera-view/camera-view';

//plugins, components and service to register in the ngModule block as per requirement
import {CommonService} from './commonService';
import { Camera } from '@ionic-native/camera';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CameraPreview } from '@ionic-native/camera-preview';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Instagram } from '@ionic-native/instagram';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CameraViewPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CameraViewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    Camera,
    Diagnostic,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonService,
    CameraPreview,
    PhotoLibrary,
    Instagram,
    Base64ToGallery,
    GoogleAnalytics
  ]
})
export class AppModule {
  
}
