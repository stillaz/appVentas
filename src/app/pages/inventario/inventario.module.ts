import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventarioPageRoutingModule } from './inventario-routing.module';

import { InventarioPage } from './inventario.page';
import { MenuInventarioComponent } from './menu-inventario/menu-inventario.component';
import { RegistroInventarioComponent } from './registro-inventario/registro-inventario.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventarioPageRoutingModule,
    PipesModule,
    ReactiveFormsModule
  ],
  declarations: [InventarioPage, MenuInventarioComponent, RegistroInventarioComponent]
})
export class InventarioPageModule {}
