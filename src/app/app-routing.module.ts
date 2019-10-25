import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'logueo', loadChildren: './logueo/logueo.module#LogueoPageModule' },
  { path: 'inventario', loadChildren: './inventario/inventario.module#InventarioPageModule' },
  { path: 'caja', loadChildren: './caja/caja.module#CajaPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  {
    path: 'producto',
    children: [
      { path: '', loadChildren: './producto/producto.module#ProductoPageModule' },
      { path: 'reporte', loadChildren: './reporte-producto/reporte-producto.module#ReporteProductoPageModule' },
    ]
  },
  {
    path: 'venta',
    children: [
      { path: 'detalle', loadChildren: './menu-carrito/menu-carrito.module#MenuCarritoPageModule' },
      {
        path: 'reporte',
        children: [
          { path: '', loadChildren: './reporte/reporte.module#ReportePageModule' },
          { path: 'detalle', loadChildren: './detalle-reporte/detalle-reporte.module#DetalleReportePageModule' }
        ]
      }
    ]
  },
  {
    path: 'configuracion',
    children: [
      { path: '', loadChildren: './configuracion/configuracion.module#ConfiguracionPageModule' },
      { path: 'combo', loadChildren: './combo/combo.module#ComboPageModule' },
      { path: 'grupo', loadChildren: './grupo/grupo.module#GrupoPageModule' },
      { path: 'usuario', loadChildren: './detalle-usuario/detalle-usuario.module#DetalleUsuarioPageModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
