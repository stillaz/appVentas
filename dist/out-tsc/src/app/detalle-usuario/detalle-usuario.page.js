import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from '../usuario.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
var DetalleUsuarioPage = /** @class */ (function () {
    function DetalleUsuarioPage(angularFirestore, usuarioService, formBuilder, platform) {
        this.angularFirestore = angularFirestore;
        this.usuarioService = usuarioService;
        this.formBuilder = formBuilder;
        this.platform = platform;
    }
    DetalleUsuarioPage.prototype.ngOnInit = function () {
        this.mobile = this.platform.is('cordova');
        this.updateUsuario();
    };
    DetalleUsuarioPage.prototype.updateUsuario = function () {
        var _this = this;
        this.id = this.usuarioService.getUsuario().id;
        var usuarioDoc = this.angularFirestore.doc("usuarios/" + this.id);
        usuarioDoc.valueChanges().subscribe(function (usuario) {
            _this.usuario = usuario;
            _this.form();
        });
    };
    DetalleUsuarioPage.prototype.form = function () {
        this.todo = this.formBuilder.group({
            email: [{ value: this.usuario.email, disabled: true }, Validators.required],
            clave: [{ value: '*****', disabled: true }, Validators.required],
            telefono: [this.usuario.telefono, Validators.required],
            imagen: [this.usuario.imagen]
        });
    };
    DetalleUsuarioPage = tslib_1.__decorate([
        Component({
            selector: 'app-detalle-usuario',
            templateUrl: './detalle-usuario.page.html',
            styleUrls: ['./detalle-usuario.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore,
            UsuarioService,
            FormBuilder,
            Platform])
    ], DetalleUsuarioPage);
    return DetalleUsuarioPage;
}());
export { DetalleUsuarioPage };
//# sourceMappingURL=detalle-usuario.page.js.map