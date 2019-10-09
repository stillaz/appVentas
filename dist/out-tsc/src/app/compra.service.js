import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { EstadoVenta } from './estado-venta.enum';
import { UsuarioService } from './usuario.service';
import { Subject } from 'rxjs';
var CompraService = /** @class */ (function () {
    function CompraService(usuarioService) {
        this.usuarioService = usuarioService;
        this.subject = new Subject();
    }
    CompraService.prototype.agregar = function (producto) {
        var detalleFactura = this.venta.detalle;
        var item = detalleFactura.find(function (item) { return item.producto.id === producto.id; });
        if (item) {
            item.cantidad++;
            item.subtotal = item.cantidad * item.producto.precio;
        }
        else {
            detalleFactura.push({ producto: producto, cantidad: 1, subtotal: producto.precio });
        }
        this.venta.total = detalleFactura.map(function (item) { return item.subtotal; }).reduce(function (a, b) { return a + b; });
        this.updateCantidad(detalleFactura);
    };
    CompraService.prototype.getCantidad = function () {
        return this.subject.asObservable();
    };
    CompraService.prototype.nuevaVenta = function () {
        this.venta = {
            detalle: [],
            devuelta: null,
            id: null,
            pago: null,
            total: 0,
            recibido: 0,
            estado: EstadoVenta.PENDIENTE,
            turno: null,
            fecha: null,
            usuario: this.usuarioService.getUsuario()
        };
    };
    CompraService.prototype.quitar = function (idproducto) {
        var detalleFactura = this.venta.detalle;
        var item = detalleFactura.find(function (item) { return item.producto.id === idproducto; });
        var index = detalleFactura.indexOf(item);
        detalleFactura.splice(index, 1);
        this.updateCantidad(detalleFactura);
    };
    CompraService.prototype.updateCantidad = function (detalleFactura) {
        this.venta.total = detalleFactura[0] && detalleFactura.map(function (item) { return item.subtotal; }).reduce(function (a, b) { return a + b; });
        var cantidad = detalleFactura[0] && detalleFactura.map(function (item) { return item.cantidad; }).reduce(function (a, b) { return a + b; });
        this.subject.next(cantidad);
    };
    CompraService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [UsuarioService])
    ], CompraService);
    return CompraService;
}());
export { CompraService };
//# sourceMappingURL=compra.service.js.map