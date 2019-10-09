import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { EstadoVenta } from '../estado-venta.enum';
import { ModalController } from '@ionic/angular';
import { PagoPage } from '../pago/pago.page';
var PendientePage = /** @class */ (function () {
    function PendientePage(angularFirestore, modalController) {
        this.angularFirestore = angularFirestore;
        this.modalController = modalController;
    }
    PendientePage.prototype.ngOnInit = function () {
        this.updatePendientes();
    };
    PendientePage.prototype.finalizar = function (pendiente) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: PagoPage,
                            componentProps: {
                                venta: pendiente
                            }
                        })];
                    case 1:
                        modal = _a.sent();
                        modal.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    PendientePage.prototype.loadVentasDia = function (id) {
        var ventasPendientesCollection = this.angularFirestore.collection("ventas/" + id + "/ventas", function (ref) { return ref.where('estado', '==', EstadoVenta.ENTREGADO); });
        return new Promise(function (resolve) {
            ventasPendientesCollection.valueChanges().subscribe(function (ventas) {
                resolve(ventas);
            });
        });
    };
    PendientePage.prototype.updatePendientes = function () {
        var _this = this;
        var pendientesCollection = this.angularFirestore.collection('ventas', function (ref) { return ref.where('pendiente', '>=', 1); });
        pendientesCollection.valueChanges().subscribe(function (pendientes) {
            _this.pendientes = [];
            pendientes.forEach(function (dia) {
                _this.loadVentasDia(dia.id).then(function (ventas) {
                    _this.pendientes.push.apply(_this.pendientes, ventas);
                });
            });
        });
    };
    PendientePage = tslib_1.__decorate([
        Component({
            selector: 'app-pendiente',
            templateUrl: './pendiente.page.html',
            styleUrls: ['./pendiente.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore,
            ModalController])
    ], PendientePage);
    return PendientePage;
}());
export { PendientePage };
//# sourceMappingURL=pendiente.page.js.map