import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { MonprofilePage } from './monprofile.page';

const routes: Routes = [
  {
    path: '',
    component: MonprofilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [MonprofilePage]
})
export class MonprofilePageModule {}
