import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetalleInventarioPage } from './detalle-inventario.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleInventarioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetalleInventarioPage]
})
export class DetalleInventarioPageModule {}
