import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductoPage } from './producto.page';
import { MenuComponent } from './menu/menu.component';
import { DetalleInventarioComponent } from '../inventario/detalle-inventario/detalle-inventario.component';

const routes: Routes = [
  {
    path: '',
    component: ProductoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ProductoPage, MenuComponent],
  entryComponents: [DetalleInventarioComponent, MenuComponent]
})
export class ProductoPageModule { }
