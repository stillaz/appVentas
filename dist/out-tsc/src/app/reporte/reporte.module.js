import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ReportePage } from './reporte.page';
var routes = [
    {
        path: '',
        component: ReportePage
    }
];
var ReportePageModule = /** @class */ (function () {
    function ReportePageModule() {
    }
    ReportePageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [ReportePage]
        })
    ], ReportePageModule);
    return ReportePageModule;
}());
export { ReportePageModule };
//# sourceMappingURL=reporte.module.js.map