import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ReporteProductoPage } from './reporte-producto.page';
var routes = [
    {
        path: '',
        component: ReporteProductoPage
    }
];
var ReporteProductoPageModule = /** @class */ (function () {
    function ReporteProductoPageModule() {
    }
    ReporteProductoPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [ReporteProductoPage]
        })
    ], ReporteProductoPageModule);
    return ReporteProductoPageModule;
}());
export { ReporteProductoPageModule };
//# sourceMappingURL=reporte-producto.module.js.map