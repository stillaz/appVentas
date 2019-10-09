import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
var VentaPage = /** @class */ (function () {
    function VentaPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    VentaPage.prototype.ngOnInit = function () {
    };
    VentaPage.prototype.ir = function (pagina) {
        this.navCtrl.navigateForward("/tabs/venta/" + pagina);
    };
    VentaPage = tslib_1.__decorate([
        Component({
            selector: 'app-venta',
            templateUrl: './venta.page.html',
            styleUrls: ['./venta.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [NavController])
    ], VentaPage);
    return VentaPage;
}());
export { VentaPage };
//# sourceMappingURL=venta.page.js.map