import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TriangulatorPage } from './triangulator';

@NgModule({
  declarations: [
    TriangulatorPage,
  ],
  imports: [
    IonicPageModule.forChild(TriangulatorPage),
  ],
})
export class TriangulatorPageModule {}
