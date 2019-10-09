import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController, MenuController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { CalendarioPage } from '../calendario/calendario.page';
var ReporteProductoPage = /** @class */ (function () {
    function ReporteProductoPage(angularFirestore, modalController, menuController, navController) {
        this.angularFirestore = angularFirestore;
        this.modalController = modalController;
        this.menuController = menuController;
        this.navController = navController;
        this.filtros = [
            'DIARIO',
            'SEMANAL',
            'MENSUAL',
            'ANUAL'
        ];
        this.atras = true;
        this.customActionSheetOptions = {
            cssClass: 'actionMes'
        };
    }
    ReporteProductoPage.prototype.ngOnInit = function () {
        this.fecha = new Date();
        this.updateFechasMes(new Date());
        this.updateReporte('MENSUAL');
    };
    ReporteProductoPage.prototype.ver = function (idusuario) {
        this.navController.navigateForward(['tabs/venta/reporte/detalle', {
                idusuario: idusuario,
                fecha: this.fecha.getTime().toString()
            }]);
    };
    ReporteProductoPage.prototype.updateFechasMes = function (fechaSeleccionada) {
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
    ReporteProductoPage.prototype.seleccionarMes = function (seleccionado) {
        var fecha = seleccionado.fecha;
        var fechaInicio = moment(fecha).startOf('month').toDate();
        var fechaFin = moment(fecha).endOf('month').toDate();
        this.fecha = fechaInicio;
        this.updateReporteMensual(fechaInicio, fechaFin);
    };
    ReporteProductoPage.prototype.seleccionarFecha = function () {
        this.presentModalCalendario();
    };
    ReporteProductoPage.prototype.seleccionarSemana = function (valor) {
        var diaSemana = moment(this.fecha).add(valor, 'week');
        var fechaInicio = diaSemana.startOf('week').add(1, 'day').toDate();
        var fechaFin = diaSemana.endOf('week').add(1, 'day').toDate();
        var textoInicio = moment(fechaInicio).locale('es').format('[Del] DD ');
        var textoFin = moment(fechaFin).locale('es').format('[al] DD [de] MMMM [de] YYYY');
        this.semana = (textoInicio + " " + textoFin).toLocaleUpperCase();
        this.adelante = fechaFin < new Date();
        this.fecha = fechaInicio;
        this.updateReporteSemanal(fechaInicio, fechaFin);
    };
    ReporteProductoPage.prototype.seleccionarAnno = function (valor) {
        var anno = moment(this.fecha).add(valor, 'year');
        var fechaInicio = anno.startOf('year').toDate();
        var fechaFin = anno.endOf('year').toDate();
        this.anno = anno.year().toString();
        this.adelante = fechaFin < new Date();
        this.fecha = fechaInicio;
        this.updateReporteAnual(fechaInicio, fechaFin);
    };
    ReporteProductoPage.prototype.presentModalCalendario = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: CalendarioPage,
                            componentProps: {
                                fecha: this.fecha
                            }
                        })];
                    case 1:
                        modal = _a.sent();
                        modal.onDidDismiss().then(function (res) {
                            var data = res.data;
                            if (data) {
                                _this.fecha = data.fecha;
                                _this.updateReporteDiario(_this.fecha);
                            }
                        });
                        return [4 /*yield*/, modal.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ReporteProductoPage.prototype.updateReporte = function (filtro) {
        this.menuController.close();
        this.fecha = new Date();
        this.periocidad = filtro;
        switch (filtro) {
            case 'DIARIO':
                this.updateReporteDiario(this.fecha);
                break;
            case 'SEMANAL':
                this.seleccionarSemana(0);
                break;
            case 'MENSUAL':
                var fechaInicio = moment(this.fecha).startOf('month').toDate();
                var fechaFin = moment(this.fecha).endOf('month').toDate();
                this.updateReporteMensual(fechaInicio, fechaFin);
                break;
            case 'ANUAL':
                this.seleccionarAnno(0);
                break;
        }
    };
    ReporteProductoPage.prototype.updateReporteDiario = function (fecha) {
        var _this = this;
        var idFecha = moment(fecha).startOf('day').toDate().getTime();
        var ventasCollection = this.angularFirestore.collection("ventas/" + idFecha + "/ventas");
        ventasCollection.valueChanges().subscribe(function (ventas) {
            _this.iniciarReporte();
            ventas.forEach(function (venta) {
                var detalleReporte = _this.reporte.detalle;
                var productosVenta = venta.detalle;
                productosVenta.forEach(function (productoVenta) {
                    var reporteProducto = detalleReporte.find(function (reporte) { return reporte.producto.id === productoVenta.producto.id; });
                    if (reporteProducto) {
                        reporteProducto.cantidad += Number(productoVenta.cantidad);
                    }
                    else {
                        detalleReporte.push({
                            cantidad: productoVenta.cantidad,
                            producto: productoVenta.producto
                        });
                    }
                });
            });
            var detalleReporte = _this.reporte.detalle;
            detalleReporte.sort(function (a, b) {
                if (Number(a.cantidad) < Number(b.cantidad)) {
                    return 1;
                }
                else if (Number(a.cantidad) > Number(b.cantidad)) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
            _this.reporte.mayor = detalleReporte[0];
            _this.reporte.menor = detalleReporte[0] ? detalleReporte[detalleReporte.length - 1] : null;
        });
    };
    ReporteProductoPage.prototype.updateReporteSemanal = function (fechaInicio, fechaFin) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var fecha, promise;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.iniciarReporte();
                        fecha = fechaInicio;
                        _a.label = 1;
                    case 1:
                        if (!(fecha <= fechaFin)) return [3 /*break*/, 3];
                        promise = this.loadReporteFecha(fecha).then(function (ventas) {
                            ventas.forEach(function (venta) {
                                var detalleReporte = _this.reporte.detalle;
                                var productosVenta = venta.detalle;
                                productosVenta.forEach(function (productoVenta) {
                                    var reporteProducto = detalleReporte.find(function (reporte) { return reporte.producto.id === productoVenta.producto.id; });
                                    if (reporteProducto) {
                                        reporteProducto.cantidad += Number(productoVenta.cantidad);
                                    }
                                    else {
                                        detalleReporte.push({
                                            cantidad: productoVenta.cantidad,
                                            producto: productoVenta.producto
                                        });
                                    }
                                });
                            });
                            var detalleReporte = _this.reporte.detalle;
                            detalleReporte.sort(function (a, b) {
                                if (Number(a.cantidad) < Number(b.cantidad)) {
                                    return 1;
                                }
                                else if (Number(a.cantidad) > Number(b.cantidad)) {
                                    return -1;
                                }
                                else {
                                    return 0;
                                }
                            });
                            _this.reporte.mayor = detalleReporte[0];
                            _this.reporte.menor = detalleReporte[0] ? detalleReporte[detalleReporte.length - 1] : null;
                        });
                        return [4 /*yield*/, promise];
                    case 2:
                        _a.sent();
                        fecha = moment(fecha).add(1, 'days').toDate();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReporteProductoPage.prototype.loadReporteFecha = function (fecha) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var idFecha;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                idFecha = moment(fecha).startOf('day').toDate().getTime();
                return [2 /*return*/, new Promise(function (resolve) {
                        var ventasDiaCollection = _this.angularFirestore.collection("ventas/" + idFecha + "/ventas");
                        ventasDiaCollection.valueChanges().subscribe(function (ventas) {
                            resolve(ventas);
                        });
                    })];
            });
        });
    };
    ReporteProductoPage.prototype.updateReporteMensual = function (fechaInicio, fechaFin) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var fecha, promise;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.iniciarReporte();
                        fecha = fechaInicio;
                        _a.label = 1;
                    case 1:
                        if (!(fecha <= fechaFin)) return [3 /*break*/, 3];
                        promise = this.loadReporteFecha(fecha).then(function (ventas) {
                            ventas.forEach(function (venta) {
                                var detalleReporte = _this.reporte.detalle;
                                var productosVenta = venta.detalle;
                                productosVenta.forEach(function (productoVenta) {
                                    var reporteProducto = detalleReporte.find(function (reporte) { return reporte.producto.id === productoVenta.producto.id; });
                                    if (reporteProducto) {
                                        reporteProducto.cantidad += Number(productoVenta.cantidad);
                                    }
                                    else {
                                        detalleReporte.push({
                                            cantidad: productoVenta.cantidad,
                                            producto: productoVenta.producto
                                        });
                                    }
                                });
                            });
                            var detalleReporte = _this.reporte.detalle;
                            detalleReporte.sort(function (a, b) {
                                if (Number(a.cantidad) < Number(b.cantidad)) {
                                    return 1;
                                }
                                else if (Number(a.cantidad) > Number(b.cantidad)) {
                                    return -1;
                                }
                                else {
                                    return 0;
                                }
                            });
                            _this.reporte.mayor = detalleReporte[0];
                            _this.reporte.menor = detalleReporte[0] ? detalleReporte[detalleReporte.length - 1] : null;
                        });
                        return [4 /*yield*/, promise];
                    case 2:
                        _a.sent();
                        fecha = moment(fecha).add(1, 'days').toDate();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReporteProductoPage.prototype.updateReporteAnual = function (fechaInicio, fechaFin) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var fecha, promise;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.iniciarReporte();
                        fecha = fechaInicio;
                        _a.label = 1;
                    case 1:
                        if (!(fecha <= fechaFin)) return [3 /*break*/, 3];
                        promise = this.loadReporteFecha(fecha).then(function (ventas) {
                            ventas.forEach(function (venta) {
                                var detalleReporte = _this.reporte.detalle;
                                var productosVenta = venta.detalle;
                                productosVenta.forEach(function (productoVenta) {
                                    var reporteProducto = detalleReporte.find(function (reporte) { return reporte.producto.id === productoVenta.producto.id; });
                                    if (reporteProducto) {
                                        reporteProducto.cantidad += Number(productoVenta.cantidad);
                                    }
                                    else {
                                        detalleReporte.push({
                                            cantidad: productoVenta.cantidad,
                                            producto: productoVenta.producto
                                        });
                                    }
                                });
                            });
                            var detalleReporte = _this.reporte.detalle;
                            detalleReporte.sort(function (a, b) {
                                if (Number(a.cantidad) < Number(b.cantidad)) {
                                    return 1;
                                }
                                else if (Number(a.cantidad) > Number(b.cantidad)) {
                                    return -1;
                                }
                                else {
                                    return 0;
                                }
                            });
                            _this.reporte.mayor = detalleReporte[0];
                            _this.reporte.menor = detalleReporte[0] ? detalleReporte[detalleReporte.length - 1] : null;
                        });
                        return [4 /*yield*/, promise];
                    case 2:
                        _a.sent();
                        fecha = moment(fecha).add(1, 'days').toDate();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReporteProductoPage.prototype.iniciarReporte = function () {
        this.reporte = {
            mayor: {},
            menor: {},
            detalle: []
        };
    };
    ReporteProductoPage = tslib_1.__decorate([
        Component({
            selector: 'app-reporte-producto',
            templateUrl: './reporte-producto.page.html',
            styleUrls: ['./reporte-producto.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore,
            ModalController,
            MenuController,
            NavController])
    ], ReporteProductoPage);
    return ReporteProductoPage;
}());
export { ReporteProductoPage };
//# sourceMappingURL=reporte-producto.page.js.map