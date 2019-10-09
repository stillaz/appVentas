import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { InventarioComponent } from '../inventario/inventario.component';
var MenuComponent = /** @class */ (function () {
    function MenuComponent(modalController, popoverController) {
        this.modalController = modalController;
        this.popoverController = popoverController;
    }
    MenuComponent.prototype.ngOnInit = function () { };
    MenuComponent.prototype.inventario = function (producto) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: InventarioComponent,
                            componentProps: {
                                idproducto: producto
                            }
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2:
                        _a.sent();
                        this.popoverController.dismiss();
                        return [2 /*return*/];
                }
            });
        });
    };
    MenuComponent = tslib_1.__decorate([
        Component({
            selector: 'app-menu',
            templateUrl: './menu.component.html',
            styleUrls: ['./menu.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController,
            PopoverController])
    ], MenuComponent);
    return MenuComponent;
}());
export { MenuComponent };
//# sourceMappingURL=menu.component.js.map