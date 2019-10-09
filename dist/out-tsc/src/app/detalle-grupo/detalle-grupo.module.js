import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DetalleGrupoPage } from './detalle-grupo.page';
var routes = [
    {
        path: '',
        component: DetalleGrupoPage
    }
];
var DetalleGrupoPageModule = /** @class */ (function () {
    function DetalleGrupoPageModule() {
    }
    DetalleGrupoPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                ReactiveFormsModule,
                RouterModule.forChild(routes)
            ],
            declarations: [DetalleGrupoPage]
        })
    ], DetalleGrupoPageModule);
    return DetalleGrupoPageModule;
}());
export { DetalleGrupoPageModule };
//# sourceMappingURL=detalle-grupo.module.js.map