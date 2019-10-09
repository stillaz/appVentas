import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { GrupoPage } from './grupo.page';
var routes = [
    {
        path: '',
        component: GrupoPage
    }
];
var GrupoPageModule = /** @class */ (function () {
    function GrupoPageModule() {
    }
    GrupoPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [GrupoPage]
        })
    ], GrupoPageModule);
    return GrupoPageModule;
}());
export { GrupoPageModule };
//# sourceMappingURL=grupo.module.js.map