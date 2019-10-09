import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
var AppComponent = /** @class */ (function () {
    function AppComponent(platform, splashScreen, statusBar, angularFireAuth, angularFirestore, navController, usuarioService) {
        this.platform = platform;
        this.splashScreen = splashScreen;
        this.statusBar = statusBar;
        this.angularFireAuth = angularFireAuth;
        this.angularFirestore = angularFirestore;
        this.navController = navController;
        this.usuarioService = usuarioService;
        this.initializeApp();
    }
    AppComponent.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
            _this.logueo();
        });
    };
    AppComponent.prototype.logueo = function () {
        var _this = this;
        this.angularFireAuth.auth.onAuthStateChanged(function (user) {
            if (user) {
                var usuarioDoc = _this.angularFirestore.doc('usuarios/' + user.uid);
                usuarioDoc.valueChanges().subscribe(function (data) {
                    if (data) {
                        _this.usuarioService.setUsuario(data);
                        _this.navController.navigateRoot('tabs/venta');
                    }
                    else {
                        alert('Usuario no encontrado');
                    }
                });
            }
            else {
                _this.navController.navigateRoot('logueo');
            }
        });
    };
    AppComponent = tslib_1.__decorate([
        Component({
            selector: 'app-root',
            templateUrl: 'app.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [Platform,
            SplashScreen,
            StatusBar,
            AngularFireAuth,
            AngularFirestore,
            NavController,
            UsuarioService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map