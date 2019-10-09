import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
var DetalleReporteVentaPage = /** @class */ (function () {
    function DetalleReporteVentaPage(navParams, angularFirestore, modalController) {
        this.navParams = navParams;
        this.angularFirestore = angularFirestore;
        this.modalController = modalController;
    }
    DetalleReporteVentaPage.prototype.ngOnInit = function () {
        this.id = this.navParams.get('idventa');
        this.fecha = this.navParams.get('fecha');
        this.updateVenta();
    };
    DetalleReporteVentaPage.prototype.updateVenta = function () {
        var _this = this;
        var ventaDoc = this.angularFirestore.doc("ventas/" + this.fecha + "/ventas/" + this.id);
        ventaDoc.valueChanges().subscribe(function (venta) {
            _this.venta = venta;
        });
    };
    DetalleReporteVentaPage.prototype.salir = function () {
        this.modalController.dismiss();
    };
    DetalleReporteVentaPage = tslib_1.__decorate([
        Component({
            selector: 'app-detalle-reporte-venta',
            templateUrl: './detalle-reporte-venta.page.html',
            styleUrls: ['./detalle-reporte-venta.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [NavParams,
            AngularFirestore,
            ModalController])
    ], DetalleReporteVentaPage);
    return DetalleReporteVentaPage;
}());
export { DetalleReporteVentaPage };
//# sourceMappingURL=detalle-reporte-venta.page.js.map