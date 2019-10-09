import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PagoPage } from './pago.page';
import { PipesModule } from '../pipes.module';
var routes = [
    {
        path: '',
        component: PagoPage
    }
];
var PagoPageModule = /** @class */ (function () {
    function PagoPageModule() {
    }
    PagoPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                ReactiveFormsModule,
                RouterModule.forChild(routes),
                PipesModule
            ],
            declarations: [PagoPage]
        })
    ], PagoPageModule);
    return PagoPageModule;
}());
export { PagoPageModule };
//# sourceMappingURL=pago.module.js.map