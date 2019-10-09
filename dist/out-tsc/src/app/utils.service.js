import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
var UtilsService = /** @class */ (function () {
    function UtilsService() {
    }
    UtilsService.prototype.amoneda = function (valor) {
        var res = !isNaN(valor) && valor.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        });
        return res;
    };
    UtilsService.prototype.anumero = function (valor) {
        var res = isNaN(valor) ? parseInt(valor.replace(/[^\d]/g, "")) : Number(valor);
        return res;
    };
    UtilsService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], UtilsService);
    return UtilsService;
}());
export { UtilsService };
//# sourceMappingURL=utils.service.js.map