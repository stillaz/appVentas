import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PendientePage } from './pendiente.page';
var routes = [
    {
        path: '',
        component: PendientePage
    }
];
var PendientePageModule = /** @class */ (function () {
    function PendientePageModule() {
    }
    PendientePageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [PendientePage]
        })
    ], PendientePageModule);
    return PendientePageModule;
}());
export { PendientePageModule };
//# sourceMappingURL=pendiente.module.js.map