import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatePickerModule } from 'ionic4-date-picker';
import { IonicModule } from '@ionic/angular';
import { CalendarioPage } from './calendario.page';
var routes = [
    {
        path: '',
        component: CalendarioPage
    }
];
var CalendarioPageModule = /** @class */ (function () {
    function CalendarioPageModule() {
    }
    CalendarioPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                DatePickerModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [CalendarioPage]
        })
    ], CalendarioPageModule);
    return CalendarioPageModule;
}());
export { CalendarioPageModule };
//# sourceMappingURL=calendario.module.js.map