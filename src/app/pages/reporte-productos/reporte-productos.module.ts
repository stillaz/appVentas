import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReporteProductosPageRoutingModule } from './reporte-productos-routing.module';

import { ReporteProductosPage } from './reporte-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReporteProductosPageRoutingModule
  ],
  declarations: [ReporteProductosPage]
})
export class ReporteProductosPageModule {}
