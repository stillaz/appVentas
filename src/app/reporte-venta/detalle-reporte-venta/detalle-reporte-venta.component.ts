import { Component, OnInit } from '@angular/core';
import { UsuarioOptions } from 'src/app/usuario-options';
import { VentaOptions } from 'src/app/venta-options';
import { NavController, LoadingController, ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { DetalleVentaComponent } from 'src/app/venta/detalle-venta/detalle-venta.component';

@Component({
  selector: 'app-detalle-reporte-venta',
  templateUrl: './detalle-reporte-venta.component.html',
  styleUrls: ['./detalle-reporte-venta.component.scss'],
})
export class DetalleReporteVentaComponent implements OnInit {

  public idusuario: string;
  public fecha: Date;
  public usuario: UsuarioOptions;
  public reporte: {
    detalle: [{
      fecha: string,
      total: number,
      ventas: VentaOptions[]
    }],
    cantidad: number,
    total: number
  };
  public fechas: [{
    fecha: Date,
    texto: string
  }];
  public mesSeleccionado: {
    fecha: Date,
    texto: string
  };

  public customActionSheetOptions = {
    cssClass: 'actionMes'
  };

  constructor(
    public navController: NavController,
    private angularFirestore: AngularFirestore,
    private activeRouter: ActivatedRoute,
    public loadingController: LoadingController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.idusuario = this.activeRouter.snapshot.paramMap.get('idusuario');
    this.fecha = new Date(Number(this.activeRouter.snapshot.paramMap.get('fecha')));
    if (!this.idusuario || !this.fecha) {
      this.navController.back();
    }
    this.initReporte();
    this.updateUsuario();
    this.updateVentasUsuario();
    this.updateFechasMes(this.fecha);
  }

  public initReporte() {
    this.reporte = {
      cantidad: 0,
      detalle: [] as any,
      total: 0
    };
  }

  public updateFechasMes(fechaSeleccionada: Date) {
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

  public seleccionarMes(seleccionado: any) {
    this.initReporte();
    this.fecha = seleccionado.fecha;
    this.updateVentasUsuario();
  }

  private updateUsuario() {
    const usuarioDoc = this.angularFirestore.doc<UsuarioOptions>(`usuarios/${this.idusuario}`);
    usuarioDoc.valueChanges().subscribe(usuario => {
      this.usuario = usuario;
    });
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
      await this.loadVentasDiaUsuario(fecha.getTime().toString()).then(ventas => {
        if (ventas[0]) {
          const totalDia = ventas.map(venta => venta.recibido).reduce((a, b) => a + b);
          this.reporte.cantidad += ventas.length;
          this.reporte.total += totalDia;
          this.reporte.detalle.push({ fecha: texto, total: totalDia, ventas: ventas });
        }
      });
      fecha = moment(fecha).add(-1, 'day').toDate();
    }

    loading.dismiss();
  }

  private async loadVentasDiaUsuario(idfecha: string) {
    const ventasDiaCollection = this.angularFirestore.collection<VentaOptions>(`ventas/${idfecha}/ventas`, ref => ref.where('usuario.id', '==', this.idusuario).orderBy('fecha', 'desc'));
    return new Promise<VentaOptions[]>(resolve => {
      ventasDiaCollection.valueChanges().subscribe(ventas => {
        resolve(ventas);
      });
    });
  }

  public ver(idventa: string, fecha: Date) {
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
