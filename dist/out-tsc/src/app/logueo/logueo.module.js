import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LogueoPage } from './logueo.page';
var routes = [
    {
        path: '',
        component: LogueoPage
    }
];
var LogueoPageModule = /** @class */ (function () {
    function LogueoPageModule() {
    }
    LogueoPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                ReactiveFormsModule,
                RouterModule.forChild(routes)
            ],
            declarations: [LogueoPage]
        })
    ], LogueoPageModule);
    return LogueoPageModule;
}());
export { LogueoPageModule };
//# sourceMappingURL=logueo.module.js.map