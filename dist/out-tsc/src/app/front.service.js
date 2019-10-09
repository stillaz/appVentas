import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
var FrontService = /** @class */ (function () {
    function FrontService(alertController, loadingController, toastController) {
        this.alertController = alertController;
        this.loadingController = loadingController;
        this.toastController = toastController;
    }
    FrontService.prototype.presentAlert = function (titulo, mensaje, subtitulo) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: titulo,
                            message: mensaje,
                            subHeader: subtitulo,
                            buttons: ['Aceptar']
                        })];
                    case 1:
                        alert = _a.sent();
                        alert.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    FrontService.prototype.presentLoading = function (mensaje) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadingController.create({
                            message: mensaje
                        })];
                    case 1:
                        loading = _a.sent();
                        loading.present();
                        return [2 /*return*/, loading];
                }
            });
        });
    };
    FrontService.prototype.presentToast = function (mensaje) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastController.create({
                            message: mensaje,
                            duration: 3000
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    FrontService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [AlertController,
            LoadingController,
            ToastController])
    ], FrontService);
    return FrontService;
}());
export { FrontService };
//# sourceMappingURL=front.service.js.map