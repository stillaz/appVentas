import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VentaPage } from './venta.page';
import { DetalleVentaComponent } from './detalle-venta/detalle-venta.component';
import { ComboActivoPipe } from '../combo-activo.pipe';
import { RegistroVentaComponent } from './registro-venta/registro-venta.component';

const routes: Routes = [
  {
    path: 'registro',
    component: RegistroVentaComponent,
    loadChildren: () => import('../producto/producto.module').then(m => m.ProductoPageModule)
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VentaPage, ComboActivoPipe, DetalleVentaComponent, RegistroVentaComponent],
  exports: [DetalleVentaComponent]
})
export class VentaPageModule { }
