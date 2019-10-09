import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
var GrupoService = /** @class */ (function () {
    function GrupoService() {
    }
    GrupoService.prototype.agrupar = function (items) {
        if (!items || items.some(function (item) { return !item.grupo; })) {
            return null;
        }
        else {
            var grupos_1 = [];
            var gruposItems = [];
            items.forEach(function (item) {
                var grupo = item.grupo;
                if (grupos_1[grupo.id] === undefined) {
                    grupos_1[grupo.id] = [];
                }
                grupos_1[grupo.id].push(item);
            });
            var _loop_1 = function (grupo) {
                console.log(grupo);
                console.log(grupos_1[grupo]);
                var dataGrupo = grupos_1[grupo].find(function (todos) { return todos.id === grupo; });
                console.log(dataGrupo);
                gruposItems.push({ grupo: dataGrupo, items: grupos_1[grupo] });
            };
            for (var grupo in grupos_1) {
                _loop_1(grupo);
            }
            return gruposItems;
        }
    };
    GrupoService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], GrupoService);
    return GrupoService;
}());
export { GrupoService };
//# sourceMappingURL=grupo.service.js.map