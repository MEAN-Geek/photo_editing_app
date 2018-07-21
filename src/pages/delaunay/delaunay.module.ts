import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DelaunayPage } from './delaunay';

@NgModule({
  declarations: [
    DelaunayPage,
  ],
  imports: [
    IonicPageModule.forChild(DelaunayPage),
  ],
})
export class DelaunayPageModule {}
