import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
var TabsPage = /** @class */ (function () {
    function TabsPage(angularFirestore) {
        this.angularFirestore = angularFirestore;
    }
    TabsPage.prototype.ngOnInit = function () {
        this.updatePendientes();
    };
    TabsPage.prototype.updatePendientes = function () {
        var _this = this;
        var pendientesCollection = this.angularFirestore.collection('ventas', function (ref) { return ref.where('pendiente', '>=', 1); });
        pendientesCollection.valueChanges().subscribe(function (pendientes) {
            _this.pendientes = (pendientes[0] && pendientes.map(function (pendiente) { return pendiente.pendiente; }).reduce(function (a, b) { return a + b; })) || 0;
        });
    };
    TabsPage = tslib_1.__decorate([
        Component({
            selector: 'app-tabs',
            templateUrl: 'tabs.page.html',
            styleUrls: ['tabs.page.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore])
    ], TabsPage);
    return TabsPage;
}());
export { TabsPage };
//# sourceMappingURL=tabs.page.js.map