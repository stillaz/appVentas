import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DetalleUsuarioPage } from './detalle-usuario.page';
var routes = [
    {
        path: '',
        component: DetalleUsuarioPage
    }
];
var DetalleUsuarioPageModule = /** @class */ (function () {
    function DetalleUsuarioPageModule() {
    }
    DetalleUsuarioPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                ReactiveFormsModule,
                RouterModule.forChild(routes)
            ],
            declarations: [DetalleUsuarioPage]
        })
    ], DetalleUsuarioPageModule);
    return DetalleUsuarioPageModule;
}());
export { DetalleUsuarioPageModule };
//# sourceMappingURL=detalle-usuario.module.js.map