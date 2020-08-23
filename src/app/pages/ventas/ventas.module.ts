import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VentasPageRoutingModule } from './ventas-routing.module';

import { VentasPage } from './ventas.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RegistroVentaComponent } from './registro-venta/registro-venta.component';
import { PagoComponent } from './pago/pago.component';
import { DetalleClienteComponent } from './detalle-cliente/detalle-cliente.component';
import { DetalleVentaComponent } from './detalle-venta/detalle-venta.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ReactiveFormsModule,
    VentasPageRoutingModule,
  ],
  declarations: [VentasPage, DetalleClienteComponent, DetalleVentaComponent, PagoComponent, RegistroVentaComponent],
  exports: [DetalleVentaComponent]
})
export class VentasPageModule {}
