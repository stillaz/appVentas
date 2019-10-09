import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';
var routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            { path: 'producto', loadChildren: '../producto/producto.module#ProductoPageModule' },
            { path: 'pendiente', loadChildren: '../pendiente/pendiente.module#PendientePageModule' },
            {
                path: 'venta',
                children: [
                    { path: 'detalle', loadChildren: '../menu-carrito/menu-carrito.module#MenuCarritoPageModule' },
                    {
                        path: 'reporte',
                        children: [
                            { path: '', loadChildren: '../reporte/reporte.module#ReportePageModule' },
                            { path: 'detalle', loadChildren: '../detalle-reporte/detalle-reporte.module#DetalleReportePageModule' }
                        ]
                    }, {
                        path: 'pendiente',
                        redirectTo: '/tabs/pendiente'
                    }, { path: 'reporte-producto', loadChildren: '../reporte-producto/reporte-producto.module#ReporteProductoPageModule' },
                    { path: '', loadChildren: '../venta/venta.module#VentaPageModule' }
                ]
            },
            {
                path: 'configuracion',
                children: [
                    { path: '', loadChildren: '../configuracion/configuracion.module#ConfiguracionPageModule' },
                    { path: 'combo', loadChildren: '../combo/combo.module#ComboPageModule' },
                    { path: 'grupo', loadChildren: '../grupo/grupo.module#GrupoPageModule' },
                    { path: 'usuario', loadChildren: '../detalle-usuario/detalle-usuario.module#DetalleUsuarioPageModule' }
                ]
            }, {
                path: '',
                redirectTo: '/tabs/producto',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/producto',
        pathMatch: 'full'
    }
];
var TabsPageRoutingModule = /** @class */ (function () {
    function TabsPageRoutingModule() {
    }
    TabsPageRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
        })
    ], TabsPageRoutingModule);
    return TabsPageRoutingModule;
}());
export { TabsPageRoutingModule };
//# sourceMappingURL=tabs.router.module.js.map