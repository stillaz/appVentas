import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DetalleReporteVentaPage } from './detalle-reporte-venta.page';
var routes = [
    {
        path: '',
        component: DetalleReporteVentaPage
    }
];
var DetalleReporteVentaPageModule = /** @class */ (function () {
    function DetalleReporteVentaPageModule() {
    }
    DetalleReporteVentaPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [DetalleReporteVentaPage]
        })
    ], DetalleReporteVentaPageModule);
    return DetalleReporteVentaPageModule;
}());
export { DetalleReporteVentaPageModule };
//# sourceMappingURL=detalle-reporte-venta.module.js.map