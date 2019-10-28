import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReporteVentaPage } from './reporte-venta.page';
import { DetalleReporteVentaComponent } from './detalle-reporte-venta/detalle-reporte-venta.component';

const routes: Routes = [
  {
    path: '',
    component: ReporteVentaPage
  }, {
    path: 'detalle/:idusuario/:fecha',
    component: DetalleReporteVentaComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReporteVentaPage, DetalleReporteVentaComponent]
})
export class ReporteVentaPageModule { }
