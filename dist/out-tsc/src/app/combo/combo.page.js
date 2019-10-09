import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { DetalleComboComponent } from './detalle-combo/detalle-combo.component';
import { GrupoService } from '../grupo.service';
var ComboPage = /** @class */ (function () {
    function ComboPage(angularFirestore, grupoService, modalController) {
        this.angularFirestore = angularFirestore;
        this.grupoService = grupoService;
        this.modalController = modalController;
    }
    ComboPage.prototype.ngOnInit = function () {
        this.updateCombos();
    };
    ComboPage.prototype.presentGrupoModal = function (combo) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: DetalleComboComponent,
                            componentProps: {
                                idcombo: combo
                            }
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ComboPage.prototype.updateCombos = function () {
        var _this = this;
        var gruposCollection = this.angularFirestore.collection('combos');
        gruposCollection.valueChanges().subscribe(function (combos) {
            _this.gruposCombos = _this.grupoService.agrupar(combos);
        });
    };
    ComboPage.prototype.ver = function (combo) {
        this.presentGrupoModal(combo);
    };
    ComboPage = tslib_1.__decorate([
        Component({
            selector: 'app-combo',
            templateUrl: './combo.page.html',
            styleUrls: ['./combo.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore,
            GrupoService,
            ModalController])
    ], ComboPage);
    return ComboPage;
}());
export { ComboPage };
//# sourceMappingURL=combo.page.js.map