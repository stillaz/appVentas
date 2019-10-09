import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import * as moment from 'moment';
var CalendarioPage = /** @class */ (function () {
    function CalendarioPage(modalController, navParams) {
        this.modalController = modalController;
        this.navParams = navParams;
        this.monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        this.dayLabels = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
        this.hoy = new Date();
    }
    CalendarioPage.prototype.ngOnInit = function () {
        this.fecha = this.navParams.get('fecha') || this.hoy;
        this.max = moment(this.hoy).endOf('day').toDate();
    };
    CalendarioPage.prototype.seleccionar = function (event) {
        this.fecha = event;
    };
    CalendarioPage.prototype.continuar = function () {
        this.modalController.dismiss({
            fecha: this.fecha
        });
    };
    CalendarioPage.prototype.cancelar = function () {
        this.modalController.dismiss();
    };
    CalendarioPage = tslib_1.__decorate([
        Component({
            selector: 'app-calendario',
            templateUrl: './calendario.page.html',
            styleUrls: ['./calendario.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController,
            NavParams])
    ], CalendarioPage);
    return CalendarioPage;
}());
export { CalendarioPage };
//# sourceMappingURL=calendario.page.js.map