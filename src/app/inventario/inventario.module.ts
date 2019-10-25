import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InventarioPage } from './inventario.page';
import { DetalleInventarioComponent } from './detalle-inventario/detalle-inventario.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  {
    path: '',
    component: InventarioPage
  },
  { path: 'detalle/:producto', loadChildren: '../detalle-inventario/detalle-inventario.module#DetalleInventarioPageModule' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [InventarioPage, DetalleInventarioComponent, MenuComponent],
  entryComponents: [DetalleInventarioComponent, MenuComponent]
})
export class InventarioPageModule { }
