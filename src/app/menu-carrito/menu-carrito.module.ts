import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuCarritoPage } from './menu-carrito.page';
import { ComboActivoPipe } from '../combo-activo.pipe';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuCarritoPage,
    children: [{ path: 'productos', loadChildren: '../producto/producto.module#ProductoPageModule' },]
  }, {
    path: '',
    redirectTo: 'menu/productos'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuCarritoPage, ComboActivoPipe]
})
export class MenuCarritoPageModule { }
