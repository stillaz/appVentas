import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfiguracionPage } from './configuracion.page';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracionPage
  },
  {
    path: 'cajas',
    loadChildren: () => import('../../pages/cajas/cajas.module').then(m => m.CajasPageModule)
  },
  {
    path: 'combos',
    loadChildren: () => import('../../pages/combos/combos.module').then(m => m.CombosPageModule)
  },
  {
    path: 'grupos',
    loadChildren: () => import('../../pages/grupos/grupos.module').then(m => m.GruposPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('../../pages/grupos/grupos.module').then(m => m.GruposPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('../usuarios/usuarios.module').then(m => m.UsuariosPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracionPageRoutingModule { }
