import { NgModule } from '@angular/core';
import {
  PreloadAllModules,
  RouterModule,
  Routes
} from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: 'caja',
    loadChildren: () => import('./pages/cajas/cajas.module').then(m => m.CajasPageModule),
    canActivate: [AuthGuardService]
  }, {
    path: 'configuracion',
    loadChildren: () => import('./pages/configuracion/configuracion.module').then(m => m.ConfiguracionPageModule),
    canActivate: [AuthGuardService]
  }, {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuardService]
  }, {
    path: 'inventario',
    loadChildren: () => import('./pages/inventario/inventario.module').then(m => m.InventarioPageModule),
    canActivate: [AuthGuardService]
  }, {
    path: 'logueo',
    loadChildren: () => import('./pages/logueo/logueo.module').then(m => m.LogueoPageModule)
  }, {
    path: 'productos',
    loadChildren: () => import('./pages/productos/productos.module').then(m => m.ProductosPageModule),
    canActivate: [AuthGuardService]
  },

  //{ path: 'reporte/venta', loadChildren: () => import('./pages/reporte-venta/reporte-venta.module').then(m => m.ReporteVentaPageModule) },

  //{ path: 'reporte/producto', loadChildren: () => import('./reporte-producto/reporte-producto.module').then(m => m.ReporteProductoPageModule) },

  {
    path: 'ventas',
    loadChildren: () => import('./pages/ventas/ventas.module').then(m => m.VentasPageModule)
  }, {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      { preloadingStrategy: PreloadAllModules })
  ],

  exports: [RouterModule]
})
export class AppRoutingModule { }
