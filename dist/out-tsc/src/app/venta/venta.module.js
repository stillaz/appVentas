import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { VentaPage } from './venta.page';
var routes = [
    {
        path: '',
        component: VentaPage
    }
];
var VentaPageModule = /** @class */ (function () {
    function VentaPageModule() {
    }
    VentaPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [VentaPage]
        })
    ], VentaPageModule);
    return VentaPageModule;
}());
export { VentaPageModule };
//# sourceMappingURL=venta.module.js.map