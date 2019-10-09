import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
var ConfiguracionPage = /** @class */ (function () {
    function ConfiguracionPage(navController, angularFireAuth) {
        this.navController = navController;
        this.angularFireAuth = angularFireAuth;
    }
    ConfiguracionPage.prototype.ngOnInit = function () {
    };
    ConfiguracionPage.prototype.ir = function (page) {
        this.navController.navigateForward("tabs/configuracion/" + page);
    };
    ConfiguracionPage.prototype.salir = function () {
        this.angularFireAuth.auth.signOut();
    };
    ConfiguracionPage = tslib_1.__decorate([
        Component({
            selector: 'app-configuracion',
            templateUrl: './configuracion.page.html',
            styleUrls: ['./configuracion.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [NavController,
            AngularFireAuth])
    ], ConfiguracionPage);
    return ConfiguracionPage;
}());
export { ConfiguracionPage };
//# sourceMappingURL=configuracion.page.js.map