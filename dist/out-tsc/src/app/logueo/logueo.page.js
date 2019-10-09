import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
var LogueoPage = /** @class */ (function () {
    function LogueoPage(formBuilder, angularFireAuth, alertController) {
        this.formBuilder = formBuilder;
        this.angularFireAuth = angularFireAuth;
        this.alertController = alertController;
        this.login = {};
    }
    LogueoPage.prototype.ngOnInit = function () {
        this.form();
    };
    LogueoPage.prototype.form = function () {
        this.todo = this.formBuilder.group({
            username: [this.login.username, Validators.compose([Validators.required, Validators.email])],
            password: [this.login.password, Validators.required]
        });
    };
    LogueoPage.prototype.logueo = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this.login = this.todo.value;
                result = this.angularFireAuth.auth.signInWithEmailAndPassword(this.login.username, this.login.password);
                result.catch(function (e) {
                    _this.presentAlertError(e);
                });
                return [2 /*return*/];
            });
        });
    };
    LogueoPage.prototype.presentAlertError = function (err) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Ha ocurrido un error',
                            subHeader: "Se present\u00F3 un error al loguearse en el sistema.",
                            message: "" + err,
                            buttons: ['OK']
                        })];
                    case 1:
                        alert = _a.sent();
                        alert.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    LogueoPage = tslib_1.__decorate([
        Component({
            selector: 'app-logueo',
            templateUrl: './logueo.page.html',
            styleUrls: ['./logueo.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [FormBuilder,
            AngularFireAuth,
            AlertController])
    ], LogueoPage);
    return LogueoPage;
}());
export { LogueoPage };
//# sourceMappingURL=logueo.page.js.map