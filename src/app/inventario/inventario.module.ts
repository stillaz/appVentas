import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InventarioPage } from './inventario.page';
import { DetalleInventarioComponent } from './detalle-inventario/detalle-inventario.component';

const routes: Routes = [
  {
    path: '',
    component: InventarioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [InventarioPage, DetalleInventarioComponent],
  exports: [DetalleInventarioComponent]
})
export class InventarioPageModule { }
