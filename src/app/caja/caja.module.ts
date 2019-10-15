import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CajaPage } from './caja.page';
import { DetalleCajaComponent } from './detalle-caja/detalle-caja.component';

const routes: Routes = [
  {
    path: '',
    component: CajaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CajaPage, DetalleCajaComponent],
  exports: [DetalleCajaComponent]
})
export class CajaPageModule { }
