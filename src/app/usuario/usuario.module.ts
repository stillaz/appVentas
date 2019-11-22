import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UsuarioPage } from './usuario.page';
import { DetalleUsuarioComponent } from './detalle-usuario/detalle-usuario.component';

const routes: Routes = [
  {
    path: '',
    component: UsuarioPage,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [UsuarioPage, DetalleUsuarioComponent],
  entryComponents: [DetalleUsuarioComponent]
})
export class UsuarioPageModule { }
