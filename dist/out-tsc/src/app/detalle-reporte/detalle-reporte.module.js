import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DetalleReportePage } from './detalle-reporte.page';
var routes = [
    {
        path: '',
        component: DetalleReportePage
    }
];
var DetalleReportePageModule = /** @class */ (function () {
    function DetalleReportePageModule() {
    }
    DetalleReportePageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [DetalleReportePage]
        })
    ], DetalleReportePageModule);
    return DetalleReportePageModule;
}());
export { DetalleReportePageModule };
//# sourceMappingURL=detalle-reporte.module.js.map