import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { UtilsService } from '../utils.service';
import { ModalController, AlertController, ToastController, NavController, Platform } from '@ionic/angular';
import { EstadoVenta } from '../estado-venta.enum';
import { AngularFirestore } from '@angular/fire/firestore';
import moment from 'moment';
import { Printer } from '@ionic-native/printer/ngx';
import printJS from 'print-js';
var PagoPage = /** @class */ (function () {
    function PagoPage(alertController, angularFirestore, modalController, navController, platform, printer, toastController, utilsService) {
        this.alertController = alertController;
        this.angularFirestore = angularFirestore;
        this.modalController = modalController;
        this.navController = navController;
        this.platform = platform;
        this.printer = printer;
        this.toastController = toastController;
        this.utilsService = utilsService;
        this.valores = [5000, 10000, 20000, 50000, 100000];
    }
    PagoPage.prototype.ngOnInit = function () {
        this.turnoDocument = this.angularFirestore.doc('configuracion/turno');
        this.ventaDocument = this.angularFirestore.doc('configuracion/venta');
    };
    PagoPage.prototype.actualizarIDS = function (idventa, idturno, fecha) {
        this.turnoDocument.update({ id: idturno, actualizacion: fecha });
        this.ventaDocument.update({ id: idventa, actualizacion: fecha });
    };
    PagoPage.prototype.cancelar = function () {
        this.modalController.dismiss();
    };
    PagoPage.prototype.factura = function () {
        var detalle = this.venta.detalle.map(function (item) {
            return "<tr>\n            <td> " + item.producto.nombre + " </td>\n            <td align=\"right\"> " + item.cantidad + " </td>\n            <td align=\"right\"> $ " + item.producto.precio + " </td>\n            <td align=\"right\"> $ " + item.subtotal + " </td>\n            </tr>";
        }).join(" ");
        var documento = "<div align=\"center\">\n      Empresa \n      <br/>\n      <br/> \n      Venta No. " + this.venta.id + "\n      <br/>\n      Fecha: " + this.venta.fecha.toLocaleString() + "\n      <br/>\n      </div>\n      <br/>\n      <br/>\n      <table style=\"width:100%\">\n      <tr>\n      <th>Producto</th>\n      <th>Cantidad</th>\n      <th>Precio</th>\n      <th>Subtotal</th>\n      </tr> \n      " + detalle + "\n      <tr>\n      <td colspan=\"4\" align=\"right\"><strong>Total: $</strong> " + this.venta.total + " </td>\n      </tr>\n      <tr>\n      <td colspan=\"4\" align=\"right\"><strong>Paga: $</strong> " + this.venta.pago + " </td>\n      </tr>\n      <tr>\n      <td colspan=\"4\" align=\"right\"><strong>Devuelta: $</strong> " + this.venta.devuelta + " </td>\n      </tr>\n      </table>\n      <div style=\"width: 100%; text-align: center\">Turno: " + this.venta.turno + "</div>";
        return documento;
    };
    PagoPage.prototype.finalizar = function () {
        this.modalController.dismiss();
        var batch = this.angularFirestore.firestore.batch();
        this.registrarVenta();
    };
    PagoPage.prototype.loadIDS = function () {
        var _this = this;
        var fecha = new Date();
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
    PagoPage.prototype.loadTurno = function () {
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
    PagoPage.prototype.loadVenta = function () {
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
    PagoPage.prototype.presentAlertDevolucion = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var devolucion, alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        devolucion = this.utilsService.amoneda(this.venta.devuelta);
                        return [4 /*yield*/, this.alertController.create({
                                header: "Venta " + this.venta.id,
                                subHeader: "Devoluci\u00F3n " + devolucion,
                                buttons: [{
                                        text: 'Continuar',
                                        handler: function () {
                                            _this.finalizar();
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
    PagoPage.prototype.presentAlertError = function (err, tipo) {
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
    PagoPage.prototype.presentAlertFinalizar = function () {
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
                                        _this.imprimir();
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
    PagoPage.prototype.presentToast = function (mensaje) {
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
                        this.navController.navigateBack('/tabs/venta');
                        return [2 /*return*/];
                }
            });
        });
    };
    PagoPage.prototype.imprimir = function () {
        var _this = this;
        var documento = this.factura();
        if (this.platform.is('cordova')) {
            this.printer.isAvailable().then(function () {
                var options = {
                    name: 'venta' + _this.venta.id,
                    printerId: 'printer007',
                    duplex: true,
                    landscape: true,
                    grayscale: true
                };
                _this.printer.print(documento, options).then(function () {
                    _this.presentToast('Se ha registrado la venta');
                }).catch(function (err) { return err; });
            }).catch(function (err) { return _this.presentAlertError(err, 'imprimir'); });
        }
        else {
            var configuracion = {
                documentTitle: '',
                header: '',
                printable: this.factura(),
                type: 'raw-html'
            };
            printJS(configuracion);
            this.presentToast('Se ha registrado la venta');
        }
    };
    PagoPage.prototype.registrarReporte = function (batch, fecha) {
        var _this = this;
        var recibido = this.venta.recibido;
        var fechaMes = moment(fecha).startOf('month').toDate().getTime().toString();
        var reporteDoc = this.angularFirestore.doc("reportes/" + fechaMes);
        var usuario = this.venta.usuario;
        var usuarioReporteDoc = reporteDoc.collection('ventas').doc(usuario.id);
        batch.set(reporteDoc.ref, { fecha: fecha });
        usuarioReporteDoc.ref.get().then(function (reporte) {
            if (reporte.exists) {
                var totalActual = reporte.get('total');
                var total = Number(totalActual) + recibido;
                var cantidadActual = reporte.get('cantidad');
                var cantidad = Number(cantidadActual) + 1;
                batch.update(usuarioReporteDoc.ref, {
                    total: total,
                    cantidad: cantidad,
                    fecha: fecha
                });
            }
            else {
                batch.set(usuarioReporteDoc.ref, {
                    total: recibido,
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
    PagoPage.prototype.registrarVenta = function () {
        var _this = this;
        var fecha = new Date();
        var pendiente = this.venta.estado === EstadoVenta.ENTREGADO;
        var fechaVenta = pendiente ? this.venta.fecha.toDate() : fecha;
        var recibido = this.venta.recibido;
        var idfecha = moment(fechaVenta).startOf('day').toDate().getTime().toString();
        var ventaDiaDoc = this.angularFirestore.doc("ventas/" + idfecha);
        var ventaDoc = ventaDiaDoc.collection('ventas').doc(this.venta.id.toString());
        ventaDiaDoc.ref.get().then(function (diario) {
            var batch = _this.angularFirestore.firestore.batch();
            if (diario.exists) {
                var totalActual = diario.get('total');
                var total = Number(totalActual) + recibido;
                var cantidadActual = diario.get('cantidad');
                var cantidad = Number(cantidadActual) + 1;
                var pendienteActual = diario.get('pendiente');
                var pendiente_1 = _this.venta.estado === EstadoVenta.ENTREGADO ? Number(pendienteActual) - 1 : pendienteActual;
                batch.update(ventaDiaDoc.ref, {
                    total: total,
                    cantidad: cantidad,
                    fecha: fecha,
                    pendiente: pendiente_1
                });
            }
            else {
                batch.set(ventaDiaDoc.ref, {
                    total: recibido,
                    cantidad: 1,
                    fecha: fecha,
                    id: idfecha
                });
            }
            _this.venta.fecha = fecha;
            _this.venta.estado = EstadoVenta.PAGADO;
            batch.set(ventaDoc.ref, _this.venta);
            _this.registrarReporte(batch, fecha);
        });
    };
    PagoPage.prototype.terminar = function (valor) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var pago, devuelta;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.venta.id) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadIDS()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        pago = this.utilsService.anumero(valor);
                        this.venta.pago = pago;
                        devuelta = pago - this.venta.total;
                        this.venta.devuelta = devuelta;
                        this.venta.recibido = pago - devuelta;
                        if (devuelta > 0) {
                            this.presentAlertDevolucion();
                        }
                        else if (devuelta === 0) {
                            this.finalizar();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PagoPage.prototype.valorMinimo = function () {
        var valor = this.utilsService.anumero(this.valor);
        this.valido = valor && valor >= this.venta.total;
    };
    PagoPage = tslib_1.__decorate([
        Component({
            selector: 'app-pago',
            templateUrl: './pago.page.html',
            styleUrls: ['./pago.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AlertController,
            AngularFirestore,
            ModalController,
            NavController,
            Platform,
            Printer,
            ToastController,
            UtilsService])
    ], PagoPage);
    return PagoPage;
}());
export { PagoPage };
//# sourceMappingURL=pago.page.js.map