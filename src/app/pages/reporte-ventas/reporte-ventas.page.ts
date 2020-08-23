import { Component, OnInit } from '@angular/core';
import { UsuarioOptions } from 'src/app/interfaces/usuario-options';
import { VentaOptions } from 'src/app/interfaces/venta-options';
import { LoadingController, ModalController } from '@ionic/angular';
import moment from 'moment';
import { DetalleVentaComponent } from '../ventas/detalle-venta/detalle-venta.component';
import { VentaService } from 'src/app/services/venta.service';
import { EstadoVenta } from 'src/app/enums/estado-venta.enum';

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.page.html',
  styleUrls: ['./reporte-ventas.page.scss'],
})
export class ReporteVentasPage implements OnInit {

  fecha: Date;
  usuario: UsuarioOptions;
  reporte: {
    detalle: [{
      fecha: string,
      total: number,
      ventas: VentaOptions[]
    }],
    cantidad: number,
    total: number
  };
  fechas: [{
    fecha: Date,
    texto: string
  }];
  mesSeleccionado: {
    fecha: Date,
    texto: string
  };

  customActionSheetOptions = {
    cssClass: 'actionMes'
  };

  constructor(
    private loadingController: LoadingController,
    private modalController: ModalController,
    private ventaService: VentaService
  ) { }

  ngOnInit() {
    this.fecha = new Date();
    this.initReporte();
    this.updateVentasUsuario();
    this.updateFechasMes(this.fecha);
  }

  initReporte() {
    this.reporte = {
      cantidad: 0,
      detalle: [] as any,
      total: 0
    };
  }

  updateFechasMes(fechaSeleccionada: Date) {
    this.fechas = [] as any;
    const actual = moment(fechaSeleccionada).startOf("month");
    const fechaInicio = moment(fechaSeleccionada).add(-1, "years");
    let fecha = actual.startOf("month");
    const texto = fecha.locale("es").format("MMMM - YYYY").toLocaleUpperCase();
    this.mesSeleccionado = { fecha: actual.toDate(), texto: texto };

    this.fechas.push(this.mesSeleccionado);
    while (fecha.diff(fechaInicio) > 0) {
      fecha = fecha.add(-1, "month");
      let texto = fecha.locale("es").format("MMMM - YYYY").toLocaleUpperCase();
      this.fechas.push({ fecha: fecha.toDate(), texto: texto });
    }
  }

  seleccionarMes(seleccionado: any) {
    this.initReporte();
    this.fecha = seleccionado.fecha;
    this.updateVentasUsuario();
  }

  private async updateVentasUsuario() {
    const fechaInicio = moment(this.fecha).startOf('month').toDate();
    const fechaFin = moment(this.fecha).endOf('month').startOf('day').toDate();
    const loading = await this.loadingController.create({
      message: 'Procesando...',
      duration: 2000,
      translucent: true,
      showBackdrop: true
    });

    loading.present();
    let fecha = fechaFin;
    while (fecha >= fechaInicio) {
      const texto = moment(fecha).locale('es').format('dddd, DD');
      await this.ventaService.ventasDia(fecha.getTime()).then(ventas => {
        if (ventas[0]) {
          const finalizados = ventas.filter(venta => venta.estado === EstadoVenta.FINALIZADO);
          const totalDia = finalizados.map(venta => venta.recibido).reduce((a, b) => a + b);
          this.reporte.cantidad += finalizados.length;
          this.reporte.total += totalDia;
          this.reporte.detalle.push({ fecha: texto, total: totalDia, ventas: ventas });
        }
      });
      fecha = moment(fecha).add(-1, 'day').toDate();
    }

    loading.dismiss();
  }

  ver(idventa: string, fecha: Date) {
    const idfecha = moment(fecha).startOf('day').toDate().getTime().toString();
    this.presentModalVenta(idventa, idfecha);
  }

  private async presentModalVenta(idventa: string, fecha: string) {
    const modal = await this.modalController.create({
      component: DetalleVentaComponent,
      componentProps: {
        idventa: idventa,
        fecha: fecha
      }
    });

    await modal.present();
  }

}
