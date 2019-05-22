import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PagoPage } from './pago.page';
import { PipesModule } from '../pipes.module';

const routes: Routes = [
  {
    path: '',
    component: PagoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  declarations: [PagoPage]
})
export class PagoPageModule {}
