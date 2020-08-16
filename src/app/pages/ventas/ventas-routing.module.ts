import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroVentaComponent } from './registro-venta/registro-venta.component';

const routes: Routes = [
  {
    path: 'registro',
    component: RegistroVentaComponent,
    loadChildren: () => import('../productos/productos.module').then(m => m.ProductosPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentasPageRoutingModule { }
