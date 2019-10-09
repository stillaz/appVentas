import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DetalleProductoPage } from './detalle-producto.page';
import { PipesModule } from '../pipes.module';
var routes = [
    {
        path: '',
        component: DetalleProductoPage
    }
];
var DetalleProductoPageModule = /** @class */ (function () {
    function DetalleProductoPageModule() {
    }
    DetalleProductoPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                IonicModule,
                FormsModule,
                ReactiveFormsModule,
                RouterModule.forChild(routes),
                PipesModule
            ],
            declarations: [DetalleProductoPage],
        })
    ], DetalleProductoPageModule);
    return DetalleProductoPageModule;
}());
export { DetalleProductoPageModule };
//# sourceMappingURL=detalle-producto.module.js.map