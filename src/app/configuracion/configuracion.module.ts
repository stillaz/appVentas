import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConfiguracionPage } from './configuracion.page';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracionPage
  },
  { path: 'combo', loadChildren: () => import('../combo/combo.module').then(m => m.ComboPageModule) },
  { path: 'grupo', loadChildren: () => import('../grupo/grupo.module').then(m => m.GrupoPageModule) },
  { path: 'usuario', loadChildren: () => import('../usuario/usuario.module').then(m => m.UsuarioPageModule) }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConfiguracionPage]
})
export class ConfiguracionPageModule { }
