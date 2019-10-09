import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { DetalleReporteVentaPage } from '../detalle-reporte-venta/detalle-reporte-venta.page';
var DetalleReportePage = /** @class */ (function () {
    function DetalleReportePage(navController, angularFirestore, activeRouter, loadingController, modalController) {
        this.navController = navController;
        this.angularFirestore = angularFirestore;
        this.activeRouter = activeRouter;
        this.loadingController = loadingController;
        this.modalController = modalController;
        this.customActionSheetOptions = {
            cssClass: 'actionMes'
        };
    }
    DetalleReportePage.prototype.ngOnInit = function () {
        this.idusuario = this.activeRouter.snapshot.paramMap.get('idusuario');
        this.fecha = new Date(Number(this.activeRouter.snapshot.paramMap.get('fecha')));
        if (!this.idusuario || !this.fecha) {
            this.navController.navigateRoot('tabs/ventas');
        }
        this.initReporte();
        this.updateUsuario();
        this.updateVentasUsuario();
        this.updateFechasMes(this.fecha);
    };
    DetalleReportePage.prototype.initReporte = function () {
        this.reporte = {
            cantidad: 0,
            detalle: [],
            total: 0
        };
    };
    DetalleReportePage.prototype.updateFechasMes = function (fechaSeleccionada) {
        this.fechas = [];
        var actual = moment(fechaSeleccionada).startOf("month");
        var fechaInicio = moment(fechaSeleccionada).add(-1, "years");
        var fecha = actual.startOf("month");
        var texto = fecha.locale("es").format("MMMM - YYYY").toLocaleUpperCase();
        this.mesSeleccionado = { fecha: actual.toDate(), texto: texto };
        this.fechas.push(this.mesSeleccionado);
        while (fecha.diff(fechaInicio) > 0) {
            fecha = fecha.add(-1, "month");
            var texto_1 = fecha.locale("es").format("MMMM - YYYY").toLocaleUpperCase();
            this.fechas.push({ fecha: fecha.toDate(), texto: texto_1 });
        }
    };
    DetalleReportePage.prototype.seleccionarMes = function (seleccionado) {
        this.initReporte();
        this.fecha = seleccionado.fecha;
        this.updateVentasUsuario();
    };
    DetalleReportePage.prototype.updateUsuario = function () {
        var _this = this;
        var usuarioDoc = this.angularFirestore.doc("usuarios/" + this.idusuario);
        usuarioDoc.valueChanges().subscribe(function (usuario) {
            _this.usuario = usuario;
        });
    };
    DetalleReportePage.prototype.updateVentasUsuario = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var fechaInicio, fechaFin, loading, fecha, _loop_1, this_1;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fechaInicio = moment(this.fecha).startOf('month').toDate();
                        fechaFin = moment(this.fecha).endOf('month').startOf('day').toDate();
                        return [4 /*yield*/, this.loadingController.create({
                                message: 'Procesando...',
                                duration: 2000,
                                translucent: true,
                                showBackdrop: true
                            })];
                    case 1:
                        loading = _a.sent();
                        loading.present();
                        fecha = fechaFin;
                        _loop_1 = function () {
                            var texto, promise;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        texto = moment(fecha).locale('es').format('dddd, DD');
                                        promise = this_1.loadVentasDiaUsuario(fecha.getTime().toString()).then(function (ventas) {
                                            if (ventas[0]) {
                                                var totalDia = ventas.map(function (venta) { return venta.recibido; }).reduce(function (a, b) { return a + b; });
                                                _this.reporte.cantidad += ventas.length;
                                                _this.reporte.total += totalDia;
                                                _this.reporte.detalle.push({ fecha: texto, total: totalDia, ventas: ventas });
                                            }
                                        });
                                        return [4 /*yield*/, promise];
                                    case 1:
                                        _a.sent();
                                        fecha = moment(fecha).add(-1, 'day').toDate();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a.label = 2;
                    case 2:
                        if (!(fecha >= fechaInicio)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 4:
                        loading.dismiss();
                        return [2 /*return*/];
                }
            });
        });
    };
    DetalleReportePage.prototype.loadVentasDiaUsuario = function (idfecha) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ventasDiaCollection;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                ventasDiaCollection = this.angularFirestore.collection("ventas/" + idfecha + "/ventas", function (ref) { return ref.where('usuario.id', '==', _this.idusuario).orderBy('fecha', 'desc'); });
                return [2 /*return*/, new Promise(function (resolve) {
                        ventasDiaCollection.valueChanges().subscribe(function (ventas) {
                            resolve(ventas);
                        });
                    })];
            });
        });
    };
    DetalleReportePage.prototype.ver = function (idventa, fecha) {
        var idfecha = moment(fecha).startOf('day').toDate().getTime().toString();
        this.presentModalVenta(idventa, idfecha);
    };
    DetalleReportePage.prototype.presentModalVenta = function (idventa, fecha) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: DetalleReporteVentaPage,
                            componentProps: {
                                idventa: idventa,
                                fecha: fecha
                            }
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
    DetalleReportePage = tslib_1.__decorate([
        Component({
            selector: 'app-detalle-reporte',
            templateUrl: './detalle-reporte.page.html',
            styleUrls: ['./detalle-reporte.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [NavController,
            AngularFirestore,
            ActivatedRoute,
            LoadingController,
            ModalController])
    ], DetalleReportePage);
    return DetalleReportePage;
}());
export { DetalleReportePage };
//# sourceMappingURL=detalle-reporte.page.js.map