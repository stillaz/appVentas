import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { FrontService } from 'src/app/front.service';
import { InventarioService } from 'src/app/inventario.service';
var InventarioComponent = /** @class */ (function () {
    function InventarioComponent(angularFirestore, formBuilder, frontService, inventarioService, modalController) {
        this.angularFirestore = angularFirestore;
        this.formBuilder = formBuilder;
        this.frontService = frontService;
        this.inventarioService = inventarioService;
        this.modalController = modalController;
    }
    InventarioComponent.prototype.ngOnInit = function () {
        this.updateProducto();
        if (this.idproducto !== '01' && this.idproducto !== '04') {
            this.cantidad = this.formBuilder
                .control('', Validators.compose([Validators.required, Validators.min(1), Validators.max(1000)]));
        }
    };
    InventarioComponent.prototype.cerrar = function () {
        this.modalController.dismiss();
    };
    InventarioComponent.prototype.guardar = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading, nuevo, servicio;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.frontService.presentLoading('Actualizando inventario...')];
                    case 1:
                        loading = _a.sent();
                        nuevo = Number(this.cantidad.value);
                        if (this.idproducto === '01' || this.idproducto === '04') {
                            servicio = this.inventarioService.registroProductoPreparacion(this.producto, nuevo, this.sinPreparar, this.subProductos);
                        }
                        else {
                            servicio = this.inventarioService.ingresoNuevos(this.producto, nuevo);
                        }
                        servicio.then(function () {
                            _this.modalController.dismiss();
                            _this.frontService.presentToast('Se ha actualizado el inventario correctamente');
                        }).catch(function (err) {
                            _this.frontService.presentAlert('Ha ocurrido un error.', "Error: " + err, 'Se presentó un error al actualizar el inventario del producto.');
                        }).finally(function () { return loading.dismiss(); });
                        return [2 /*return*/];
                }
            });
        });
    };
    InventarioComponent.prototype.updateInventario = function () {
        var _this = this;
        var inventarioCollection = this.angularFirestore
            .collection("productos/" + this.idproducto + "/inventario", function (ref) { return ref.orderBy('fecha', 'desc').limit(10); });
        inventarioCollection.valueChanges().subscribe(function (inventario) {
            _this.inventario = inventario;
        });
    };
    InventarioComponent.prototype.updateProducto = function () {
        var _this = this;
        var productoDocument = this.angularFirestore.doc("productos/" + this.idproducto);
        productoDocument.valueChanges().subscribe(function (producto) {
            _this.producto = producto;
            _this.updateInventario();
            if (_this.idproducto === '01' || _this.idproducto === '04') {
                _this.updateSinPreparacion();
                _this.updateSubProductos();
            }
        });
    };
    InventarioComponent.prototype.updateSinPreparacion = function () {
        var _this = this;
        var productoDocument = this.angularFirestore.doc('productos/00');
        productoDocument.valueChanges().subscribe(function (producto) {
            _this.sinPreparar = producto;
            _this.cantidad = _this.formBuilder
                .control('', Validators.compose([Validators.required, Validators.min(1), Validators.max(_this.sinPreparar.cantidad)]));
        });
    };
    InventarioComponent.prototype.updateSubProductos = function () {
        var _this = this;
        var productosCollection = this.angularFirestore.collection('productos', function (ref) { return ref.where('grupo.id', '==', _this.producto.grupo.id); });
        productosCollection.valueChanges().subscribe(function (productos) {
            _this.subProductos = productos.filter(function (producto) { return producto.id !== _this.producto.id; });
        });
    };
    InventarioComponent = tslib_1.__decorate([
        Component({
            selector: 'app-inventario',
            templateUrl: './inventario.component.html',
            styleUrls: ['./inventario.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore,
            FormBuilder,
            FrontService,
            InventarioService,
            ModalController])
    ], InventarioComponent);
    return InventarioComponent;
}());
export { InventarioComponent };
//# sourceMappingURL=inventario.component.js.map