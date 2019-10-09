import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';
import { ModalController, MenuController, NavController } from '@ionic/angular';
import { CalendarioPage } from '../calendario/calendario.page';
var ReportePage = /** @class */ (function () {
    function ReportePage(angularFirestore, modalController, menuController, navController) {
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
    ReportePage.prototype.ngOnInit = function () {
        this.fecha = new Date();
        this.updateFechasMes(new Date());
        this.updateReporte('MENSUAL');
    };
    ReportePage.prototype.ver = function (idusuario) {
        this.navController.navigateForward(['tabs/venta/reporte/detalle', {
                idusuario: idusuario,
                fecha: this.fecha.getTime().toString()
            }]);
    };
    ReportePage.prototype.updateFechasMes = function (fechaSeleccionada) {
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
    ReportePage.prototype.seleccionarMes = function (seleccionado) {
        this.updateReporteMensual(seleccionado.fecha);
    };
    ReportePage.prototype.seleccionarFecha = function () {
        this.presentModalCalendario();
    };
    ReportePage.prototype.seleccionarSemana = function (valor) {
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
    ReportePage.prototype.seleccionarAnno = function (valor) {
        var anno = moment(this.fecha).add(valor, 'year');
        var fechaInicio = anno.startOf('month').toDate();
        var fechaFin = anno.endOf('month').toDate();
        this.anno = anno.year().toString();
        this.adelante = fechaFin < new Date();
        this.fecha = fechaInicio;
        this.updateReporteAnual(fechaInicio, fechaFin);
    };
    ReportePage.prototype.presentModalCalendario = function () {
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
    ReportePage.prototype.updateReporte = function (filtro) {
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
                this.updateReporteMensual(this.fecha);
                break;
            case 'ANUAL':
                this.seleccionarAnno(0);
                break;
        }
    };
    ReportePage.prototype.updateReporteDiario = function (fecha) {
        var _this = this;
        var idFecha = moment(fecha).startOf('day').toDate().getTime();
        var ventasCollection = this.angularFirestore.collection("ventas/" + idFecha + "/ventas");
        ventasCollection.valueChanges().subscribe(function (ventas) {
            _this.iniciarReporte();
            ventas.forEach(function (venta) {
                _this.reporte.cantidad++;
                _this.reporte.total += venta.recibido;
                var detalleReporte = _this.reporte.detalle;
                var usuarioVenta = venta.usuario;
                var reporteUsuario = detalleReporte.find(function (reporte) { return reporte.usuario.id === usuarioVenta.id; });
                if (reporteUsuario) {
                    reporteUsuario.cantidad++;
                    reporteUsuario.total += venta.recibido;
                }
                else {
                    detalleReporte.push({
                        cantidad: 1,
                        total: venta.recibido,
                        usuario: usuarioVenta
                    });
                }
            });
        });
    };
    ReportePage.prototype.updateReporteSemanal = function (fechaInicio, fechaFin) {
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
                                _this.reporte.cantidad++;
                                _this.reporte.total += venta.recibido;
                                var detalleReporte = _this.reporte.detalle;
                                var usuarioVenta = venta.usuario;
                                var reporteUsuario = detalleReporte.find(function (reporte) { return reporte.usuario.id === usuarioVenta.id; });
                                if (reporteUsuario) {
                                    reporteUsuario.cantidad++;
                                    reporteUsuario.total += venta.recibido;
                                }
                                else {
                                    detalleReporte.push({
                                        cantidad: 1,
                                        total: venta.recibido,
                                        usuario: usuarioVenta
                                    });
                                }
                            });
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
    ReportePage.prototype.loadReporteFecha = function (fecha) {
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
    ReportePage.prototype.updateReporteMensual = function (fecha) {
        var _this = this;
        var idMes = moment(fecha).startOf('month').toDate().getTime();
        var ventasMesCollection = this.angularFirestore.collection("reportes/" + idMes + "/ventas");
        ventasMesCollection.valueChanges().subscribe(function (ventasUsuario) {
            _this.iniciarReporte();
            ventasUsuario.forEach(function (venta) {
                _this.reporte.cantidad += venta.cantidad;
                _this.reporte.total += venta.total;
                var detalleReporte = _this.reporte.detalle;
                var usuarioVenta = venta.usuario;
                detalleReporte.push({
                    cantidad: venta.cantidad,
                    total: venta.total,
                    usuario: usuarioVenta
                });
            });
        });
    };
    ReportePage.prototype.updateReporteAnual = function (fechaInicio, fechaFin) {
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
                        promise = this.loadReporteFechaMes(fecha).then(function (ventas) {
                            ventas.forEach(function (venta) {
                                _this.reporte.cantidad += venta.cantidad;
                                _this.reporte.total += venta.total;
                                var detalleReporte = _this.reporte.detalle;
                                detalleReporte.push({
                                    cantidad: venta.cantidad,
                                    total: venta.total,
                                    usuario: venta.usuario
                                });
                            });
                        });
                        return [4 /*yield*/, promise];
                    case 2:
                        _a.sent();
                        fecha = moment(fecha).add(1, 'month').toDate();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReportePage.prototype.loadReporteFechaMes = function (fecha) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var idFecha;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                idFecha = moment(fecha).startOf('month').toDate().getTime();
                return [2 /*return*/, new Promise(function (resolve) {
                        var ventasDiaCollection = _this.angularFirestore.collection("reportes/" + idFecha + "/ventas");
                        ventasDiaCollection.valueChanges().subscribe(function (ventas) {
                            resolve(ventas);
                        });
                    })];
            });
        });
    };
    ReportePage.prototype.iniciarReporte = function () {
        this.reporte = {
            cantidad: 0,
            detalle: [],
            total: 0
        };
    };
    ReportePage = tslib_1.__decorate([
        Component({
            selector: 'app-reporte',
            templateUrl: './reporte.page.html',
            styleUrls: ['./reporte.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore,
            ModalController,
            MenuController,
            NavController])
    ], ReportePage);
    return ReportePage;
}());
export { ReportePage };
//# sourceMappingURL=reporte.page.js.map