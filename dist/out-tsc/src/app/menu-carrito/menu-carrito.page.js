import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { CompraService } from '../compra.service';
import { AngularFirestore } from '@angular/fire/firestore';
import moment from 'moment';
import { AlertController, NavController, ToastController, ModalController } from '@ionic/angular';
import { EstadoVenta } from '../estado-venta.enum';
import { PagoPage } from '../pago/pago.page';
var MenuCarritoPage = /** @class */ (function () {
    function MenuCarritoPage(alertController, angularFirestore, compraService, modalController, navController, toastController) {
        this.alertController = alertController;
        this.angularFirestore = angularFirestore;
        this.compraService = compraService;
        this.modalController = modalController;
        this.navController = navController;
        this.toastController = toastController;
    }
    MenuCarritoPage.prototype.ngOnInit = function () {
        this.compraService.nuevaVenta();
        this.venta = this.compraService.venta;
        this.turnoDocument = this.angularFirestore.doc('configuracion/turno');
        this.ventaDocument = this.angularFirestore.doc('configuracion/venta');
    };
    MenuCarritoPage.prototype.actualizarIDS = function (idventa, idturno, fecha) {
        this.turnoDocument.update({ id: idturno, actualizacion: fecha });
        this.ventaDocument.update({ id: idventa, actualizacion: fecha });
    };
    MenuCarritoPage.prototype.cancelar = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Cancelar venta',
                            subHeader: "Desea cancelar la venta " + this.venta.id,
                            buttons: [{
                                    text: 'Si',
                                    handler: function () {
                                        _this.navController.navigateBack('/tabs/venta');
                                    }
                                }, {
                                    text: 'No',
                                    role: 'cancel'
                                }]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MenuCarritoPage.prototype.loadIDS = function (fecha) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.loadVenta().then(function (idventa) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadTurno().then(function (turno) {
                                _this.venta.id = idventa;
                                _this.venta.turno = turno;
                                _this.actualizarIDS(idventa, turno, fecha);
                            })];
                        case 1:
                            _a.sent();
                            resolve();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    MenuCarritoPage.prototype.loadTurno = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.turnoDocument.valueChanges().subscribe(function (turno) {
                if (turno) {
                    var dif = moment(new Date()).diff(turno.actualizacion.toDate(), 'hours', true);
                    if (dif < 4) {
                        resolve(Number(turno.id) + 1);
                    }
                    else {
                        resolve(1);
                    }
                }
                else {
                    reject('No fue posible obtener los datos del turno');
                }
            });
        });
    };
    MenuCarritoPage.prototype.loadVenta = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.ventaDocument.valueChanges().subscribe(function (venta) {
                if (venta) {
                    resolve(Number(venta.id) + 1);
                }
                else {
                    reject('No fue posible obtener los datos de venta');
                }
            });
        });
    };
    MenuCarritoPage.prototype.pendiente = function () {
        var fecha = new Date();
        var batch = this.angularFirestore.firestore.batch();
        this.venta.fecha = fecha;
        this.registrarVenta(batch, fecha);
    };
    MenuCarritoPage.prototype.presentAlertError = function (err, tipo) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Ha ocurrido un error',
                            subHeader: "Se present\u00F3 un error al " + tipo + " la venta.",
                            message: "Error: " + err,
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
    MenuCarritoPage.prototype.presentAlertFinalizar = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: "Venta " + this.venta.id,
                            subHeader: "Turno " + this.venta.turno,
                            buttons: [{
                                    text: 'Continuar',
                                    handler: function () {
                                        _this.presentToast('Se ha registrado la venta');
                                    }
                                }]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MenuCarritoPage.prototype.presentToast = function (mensaje) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastController.create({
                            message: mensaje,
                            duration: 3000
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        this.navController.back();
                        return [2 /*return*/];
                }
            });
        });
    };
    MenuCarritoPage.prototype.quitar = function (idproducto, nombre, cantidad) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Quitar ítem',
                            message: "\u00BFDesea quitar " + cantidad + " " + nombre + "?",
                            buttons: [{
                                    text: 'Si',
                                    handler: function () {
                                        _this.compraService.quitar(idproducto);
                                    }
                                }, 'No']
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MenuCarritoPage.prototype.registrarReporte = function (batch, fecha) {
        var _this = this;
        var fechaMes = moment(fecha).startOf('month').toDate().getTime().toString();
        var reporteDoc = this.angularFirestore.doc("reportes/" + fechaMes);
        var usuario = this.venta.usuario;
        var usuarioReporteDoc = reporteDoc.collection('ventas').doc(usuario.id);
        batch.set(reporteDoc.ref, { fecha: fecha });
        usuarioReporteDoc.ref.get().then(function (reporte) {
            if (reporte.exists) {
                var cantidadActual = reporte.get('cantidad');
                var cantidad = Number(cantidadActual) + 1;
                batch.update(usuarioReporteDoc.ref, {
                    cantidad: cantidad,
                    fecha: fecha
                });
            }
            else {
                batch.set(usuarioReporteDoc.ref, {
                    cantidad: 1,
                    fecha: fecha,
                    usuario: usuario
                });
            }
            batch.commit().then(function () {
                _this.presentAlertFinalizar();
            }).catch(function (err) {
                _this.presentAlertError(err, 'registrar');
            });
        });
    };
    MenuCarritoPage.prototype.registrarVenta = function (batch, fecha) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var fechaDia, ventaDiaDoc, ventaDoc;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadIDS(fecha)];
                    case 1:
                        _a.sent();
                        fechaDia = moment(fecha).startOf('day').toDate().getTime().toString();
                        ventaDiaDoc = this.angularFirestore.doc("ventas/" + fechaDia);
                        ventaDoc = ventaDiaDoc.collection('ventas').doc(this.venta.id.toString());
                        this.venta.estado = EstadoVenta.ENTREGADO;
                        ventaDiaDoc.ref.get().then(function (diario) {
                            if (diario.exists) {
                                var cantidadActual = diario.get('cantidad');
                                var cantidad = Number(cantidadActual) + 1;
                                var pendienteActual = diario.get('pendiente');
                                var pendiente = Number(pendienteActual) + 1;
                                batch.update(ventaDiaDoc.ref, {
                                    cantidad: cantidad,
                                    fecha: fecha,
                                    pendiente: pendiente
                                });
                            }
                            else {
                                batch.set(ventaDiaDoc.ref, {
                                    cantidad: 1,
                                    fecha: fecha,
                                    pendiente: 1
                                });
                            }
                            batch.set(ventaDoc.ref, _this.venta);
                            _this.registrarReporte(batch, fecha);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    MenuCarritoPage.prototype.terminar = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: PagoPage,
                            componentProps: {
                                venta: this.venta
                            }
                        })];
                    case 1:
                        modal = _a.sent();
                        modal.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    MenuCarritoPage = tslib_1.__decorate([
        Component({
            selector: 'app-menu-carrito',
            templateUrl: './menu-carrito.page.html',
            styleUrls: ['./menu-carrito.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AlertController,
            AngularFirestore,
            CompraService,
            ModalController,
            NavController,
            ToastController])
    ], MenuCarritoPage);
    return MenuCarritoPage;
}());
export { MenuCarritoPage };
//# sourceMappingURL=menu-carrito.page.js.map