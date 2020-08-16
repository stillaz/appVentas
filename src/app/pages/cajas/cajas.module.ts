import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CajasPageRoutingModule } from './cajas-routing.module';

import { CajasPage } from './cajas.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DetalleCajaComponent } from './detalle-caja/detalle-caja.component';
import { MensajeComponent } from './mensaje/mensaje.component';
import { MenuCajaComponent } from './menu-caja/menu-caja.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CajasPageRoutingModule,
    PipesModule,
    ReactiveFormsModule
  ],
  declarations: [CajasPage, DetalleCajaComponent, MensajeComponent, MenuCajaComponent],
  exports: [DetalleCajaComponent]
})
export class CajasPageModule { }
