import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CajaPage } from './caja.page';
import { DetalleCajaComponent } from './detalle-caja/detalle-caja.component';
import { PipesModule } from '../pipes.module';
import { MenuCajaComponent } from './menu-caja/menu-caja.component';

const routes: Routes = [
  {
    path: '',
    component: CajaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule,
    ReactiveFormsModule
  ],
  declarations: [CajaPage, DetalleCajaComponent, MenuCajaComponent],
  entryComponents: [MenuCajaComponent, DetalleCajaComponent],
  exports: [DetalleCajaComponent]
})
export class CajaPageModule { }
