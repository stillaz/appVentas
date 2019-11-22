import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GrupoPage } from './grupo.page';
import { DetalleGrupoComponent } from './detalle-grupo/detalle-grupo.component';

const routes: Routes = [
  {
    path: '',
    component: GrupoPage
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
  declarations: [GrupoPage, DetalleGrupoComponent],
  entryComponents: [DetalleGrupoComponent]
})
export class GrupoPageModule { }
