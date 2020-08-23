import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteProductosPage } from './reporte-productos.page';

const routes: Routes = [
  {
    path: '',
    component: ReporteProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteProductosPageRoutingModule {}
