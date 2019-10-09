import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { DetalleProductoPage } from '../detalle-producto/detalle-producto.page';
import { Router } from '@angular/router';
import { CompraService } from '../compra.service';
import { MenuComponent } from './menu/menu.component';
var ProductoPage = /** @class */ (function () {
    function ProductoPage(angularFirestore, compraService, modalController, popoverController, router) {
        this.angularFirestore = angularFirestore;
        this.compraService = compraService;
        this.modalController = modalController;
        this.popoverController = popoverController;
        this.router = router;
        this.busqueda = '';
        this.mensaje = true;
        this.modo = 'dos';
        this.pages = [
            { title: 'Productos más vendidos', component: '', icon: 'trending-up' },
            { title: 'Productos menos vendidos', component: '', icon: 'trending-down' },
            { title: 'Histórico inventario', component: '', icon: 'list-box' }
        ];
    }
    ProductoPage.prototype.ngOnInit = function () {
        var _this = this;
        this.gruposeleccion = 'Todos los grupos';
        this.marcaseleccion = 'Todas las marcas';
        this.updateGrupos();
        this.ventas = this.router.url.startsWith('/tabs/venta/');
        this.carrito = this.compraService.venta;
        this.compraService.getCantidad().subscribe(function (cantidad) {
            _this.cantidad = cantidad;
        });
    };
    ProductoPage.prototype.agregar = function (producto) {
        this.compraService.agregar(producto);
    };
    ProductoPage.prototype.menu = function (ev) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var popover;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.popoverController.create({
                            component: MenuComponent,
                            event: ev,
                            translucent: true
                        })];
                    case 1:
                        popover = _a.sent();
                        return [4 /*yield*/, popover.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProductoPage.prototype.updateGrupos = function () {
        var _this = this;
        var grupoCollection = this.angularFirestore.collection('grupos');
        grupoCollection.valueChanges().subscribe(function (grupos) {
            _this.grupos = grupos;
        });
    };
    ProductoPage.prototype.updateProductosGrupo = function (event) {
        var seleccionado = event.detail.value;
        var productoCollection;
        if (seleccionado == "0") {
            productoCollection = this.angularFirestore.collection('productos');
            this.agrupar = true;
        }
        else {
            productoCollection = this.angularFirestore.collection('productos', function (ref) { return ref.where('grupo.id', "==", seleccionado); });
            this.agrupar = false;
        }
        this.updateProductos(productoCollection);
    };
    ProductoPage.prototype.updateProductos = function (productoCollection) {
        var _this = this;
        productoCollection.valueChanges().subscribe(function (productos) {
            _this.productos = productos;
            _this.updateGruposProductos();
        });
    };
    ProductoPage.prototype.updateGruposProductos = function () {
        var grupos = [];
        this.gruposProducto = [];
        this.productos.forEach(function (producto) {
            var grupo = producto.grupo;
            if (grupos[grupo.id] === undefined) {
                grupos[grupo.id] = [];
            }
            grupos[grupo.id].push(producto);
        });
        var _loop_1 = function (grupo) {
            var dataGrupo = this_1.grupos.find(function (todos) { return todos.id === grupo; });
            this_1.gruposProducto.push({ grupo: dataGrupo, productos: grupos[grupo] });
        };
        var this_1 = this;
        for (var grupo in grupos) {
            _loop_1(grupo);
        }
    };
    ProductoPage.prototype.ver = function (idproducto) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: DetalleProductoPage,
                            componentProps: { idproducto: idproducto }
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
    ProductoPage = tslib_1.__decorate([
        Component({
            selector: 'app-producto',
            templateUrl: './producto.page.html',
            styleUrls: ['./producto.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore,
            CompraService,
            ModalController,
            PopoverController,
            Router])
    ], ProductoPage);
    return ProductoPage;
}());
export { ProductoPage };
//# sourceMappingURL=producto.page.js.map