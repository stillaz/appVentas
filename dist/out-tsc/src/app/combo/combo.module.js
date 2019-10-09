import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComboPage } from './combo.page';
import { DetalleComboComponent } from './detalle-combo/detalle-combo.component';
var routes = [
    {
        path: '',
        component: ComboPage
    }
];
var ComboPageModule = /** @class */ (function () {
    function ComboPageModule() {
    }
    ComboPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes),
                ReactiveFormsModule
            ],
            declarations: [ComboPage, DetalleComboComponent],
            entryComponents: [DetalleComboComponent]
        })
    ], ComboPageModule);
    return ComboPageModule;
}());
export { ComboPageModule };
//# sourceMappingURL=combo.module.js.map