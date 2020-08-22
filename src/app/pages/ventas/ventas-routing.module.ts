import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroVentaComponent } from './registro-venta/registro-venta.component';
import { VentasPage } from './ventas.page';

const routes: Routes = [
  {
    path: '',
    component: VentasPage
  },
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
