import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { DetalleGrupoPage } from '../detalle-grupo/detalle-grupo.page';
var GrupoPage = /** @class */ (function () {
    function GrupoPage(angularFirestore, modalController) {
        this.angularFirestore = angularFirestore;
        this.modalController = modalController;
    }
    GrupoPage.prototype.ngOnInit = function () {
        this.updateGrupos();
    };
    GrupoPage.prototype.updateGrupos = function () {
        var _this = this;
        var gruposCollection = this.angularFirestore.collection('grupos');
        gruposCollection.valueChanges().subscribe(function (grupos) {
            _this.grupos = grupos;
        });
    };
    GrupoPage.prototype.ver = function (idgrupo) {
        this.presentGrupoModal(idgrupo);
    };
    GrupoPage.prototype.presentGrupoModal = function (idgrupo) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: DetalleGrupoPage,
                            componentProps: {
                                idgrupo: idgrupo
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
    GrupoPage = tslib_1.__decorate([
        Component({
            selector: 'app-grupo',
            templateUrl: './grupo.page.html',
            styleUrls: ['./grupo.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore,
            ModalController])
    ], GrupoPage);
    return GrupoPage;
}());
export { GrupoPage };
//# sourceMappingURL=grupo.page.js.map