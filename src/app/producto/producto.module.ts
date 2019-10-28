import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductoPage } from './producto.page';
import { DetalleProductoComponent } from './detalle-producto/detalle-producto.component';
import { PipesModule } from '../pipes.module';

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
    PipesModule,
    ReactiveFormsModule
  ],
  declarations: [ProductoPage, DetalleProductoComponent],
  entryComponents: [DetalleProductoComponent]
})
export class ProductoPageModule { }
