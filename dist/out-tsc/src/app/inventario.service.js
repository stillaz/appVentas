import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { EstadoInventario } from './estado-inventario.enum';
import { UsuarioService } from './usuario.service';
var InventarioService = /** @class */ (function () {
    function InventarioService(angularFirestore, usuarioService) {
        this.angularFirestore = angularFirestore;
        this.usuarioService = usuarioService;
    }
    InventarioService.prototype.ingresoNuevos = function (producto, cantidad, batch, estado, id, fecha, usuario) {
        var actual = Number(producto.cantidad | 0);
        var isBatch = batch;
        batch = batch || this.angularFirestore.firestore.batch();
        fecha = fecha || new Date();
        estado = estado || EstadoInventario.INGRESAR_NUEVO;
        id = id || this.angularFirestore.createId();
        usuario = usuario || this.usuarioService.getUsuario();
        var total = cantidad + actual;
        var inventario = {
            anterior: actual,
            estado: estado,
            fecha: fecha,
            id: id,
            ingreso: cantidad,
            total: total,
            usuario: usuario
        };
        var productoDocument = this.angularFirestore.doc("productos/" + producto.id);
        var inventarioDocument = productoDocument.collection('inventario').doc(id);
        batch.set(inventarioDocument.ref, inventario);
        batch.update(productoDocument.ref, {
            cantidad: total,
            estadoinventario: estado,
            fechainventario: fecha,
            inventario: id
        });
        if (!isBatch) {
            return batch.commit();
        }
    };
    InventarioService.prototype.reducirNuevos = function (actual, batch, cantidad, estado, fecha, id, usuario) {
        var anterior = Number(actual | 0);
        var total = anterior - cantidad;
        var inventario = {
            anterior: anterior,
            estado: estado,
            fecha: fecha,
            id: id,
            ingreso: cantidad,
            total: total,
            usuario: usuario
        };
        var productoDocument = this.angularFirestore.doc('productos/00');
        var inventarioDocument = productoDocument.collection('inventario').doc(id);
        batch.set(inventarioDocument.ref, inventario);
        batch.update(productoDocument.ref, {
            cantidad: total,
            estadoinventario: estado,
            fechainventario: fecha,
            inventario: id
        });
    };
    InventarioService.prototype.registroProductoPreparacion = function (producto, cantidad, sinPreparar, subProductos) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var usuario, inventarioSinPreparar, id, fecha, estado, batch;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                usuario = this.usuarioService.getUsuario();
                inventarioSinPreparar = Number(sinPreparar.cantidad | 0);
                id = this.angularFirestore.createId();
                fecha = new Date();
                estado = producto.id === '01' ? EstadoInventario.PREPARAR_ASADO : EstadoInventario.PREPARAR_BROSTEER;
                batch = this.angularFirestore.firestore.batch();
                this.reducirNuevos(inventarioSinPreparar, batch, cantidad, estado, fecha, id, usuario);
                this.ingresoNuevos(producto, cantidad, batch, estado, id, fecha, this.usuarioService.getUsuario());
                subProductos.forEach(function (subproducto) {
                    var nombre = subproducto.nombre.toLowerCase();
                    var tipo = nombre.includes('cuarto') ? 4 : 2;
                    var cantidadsubproducto = tipo * cantidad;
                    _this.ingresoNuevos(subproducto, cantidadsubproducto, batch, estado, id, fecha, usuario);
                });
                return [2 /*return*/, batch.commit()];
            });
        });
    };
    InventarioService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore, UsuarioService])
    ], InventarioService);
    return InventarioService;
}());
export { InventarioService };
//# sourceMappingURL=inventario.service.js.map