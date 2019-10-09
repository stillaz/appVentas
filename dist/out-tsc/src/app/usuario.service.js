import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
var UsuarioService = /** @class */ (function () {
    function UsuarioService() {
    }
    UsuarioService.prototype.setUsuario = function (usuario) {
        this.usuario = usuario;
    };
    UsuarioService.prototype.getUsuario = function () {
        return this.usuario;
    };
    UsuarioService.prototype.isAdministrador = function () {
        return this.usuario ? this.usuario.perfiles.some(function (perfil) { return perfil.nombre === 'Administrador'; }) : false;
    };
    UsuarioService.prototype.getFilePathUsuario = function () {
        return "/usuarios/" + this.usuario.id;
    };
    UsuarioService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], UsuarioService);
    return UsuarioService;
}());
export { UsuarioService };
//# sourceMappingURL=usuario.service.js.map