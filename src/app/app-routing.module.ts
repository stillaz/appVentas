import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'caja', loadChildren: () => import('./caja/caja.module').then(m => m.CajaPageModule) },
  { path: 'configuracion', loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionPageModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'inventario', loadChildren: () => import('./inventario/inventario.module').then(m => m.InventarioPageModule) },
  { path: 'logueo', loadChildren: () => import('./logueo/logueo.module').then(m => m.LogueoPageModule) },
  { path: 'producto', loadChildren: () => import('./producto/producto.module').then(m => m.ProductoPageModule) },
  { path: 'reporte/venta', loadChildren: () => import('./reporte-venta/reporte-venta.module').then(m => m.ReporteVentaPageModule) },
  { path: 'reporte/producto', loadChildren: () => import('./reporte-producto/reporte-producto.module').then(m => m.ReporteProductoPageModule) },
  { path: 'venta', loadChildren: () => import('./venta/venta.module').then(m => m.VentaPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
