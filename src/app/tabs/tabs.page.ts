import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import moment from 'moment';
import { EstadoCaja } from '../estado-caja.enum';
import { AlertController, ModalController } from '@ionic/angular';
import { CajaOptions } from '../caja-options';
import { DetalleCajaComponent } from '../caja/detalle-caja/detalle-caja.component';
import { CajaService } from '../caja.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public pendientes: number;

  constructor(
    private alertController: AlertController,
    private angularFirestore: AngularFirestore,
    private cajaService: CajaService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.updatePendientes();
    this.loadCaja();
  }

  private async presentRegistroCaja(caja: string) {
    const modal = await this.modalController.create({
      component: DetalleCajaComponent,
      componentProps: {
        idcaja: caja
      }
    });

    modal.present();
  }

  private async presentAlert(titulo: string, mensaje: string, caja?: CajaOptions, subtitulo?: string) {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      buttons: [{
        text: 'Si',
        handler: () => {
          this.presentRegistroCaja(caja && caja.id);
        }
      }, 'No']
    });

    alert.present();
  }

  private loadCaja() {
    const cajaCollection = this.angularFirestore.collection<CajaOptions>('cajas');
    cajaCollection.valueChanges().subscribe(cajas => {
      if (cajas.length === 1) {
        const caja = cajas[0];
        this.cajaService.caja = caja;
        const estadocaja = caja.estado;
        if (!estadocaja) {
          this.presentAlert('Sin caja', '¿Desea abrir caja?');
        } else if (estadocaja === EstadoCaja.CERRADA) {
          this.presentAlert('Inicio de caja', '¿Desea abrir caja?', caja);
        } else {
          const idfecha = moment(caja.fecha.toDate()).locale('es').locale('LLLL');
          this.presentAlert('Caja abierta', '¿Desea cerrar caja?', caja, `La caja de ${idfecha} se encuentra abierta.`);
        }
      }
    });
  }

  private updatePendientes() {
    const pendientesCollection = this.angularFirestore.collection<any>('ventas', ref => ref.where('pendiente', '>=', 1));
    pendientesCollection.valueChanges().subscribe(pendientes => {
      this.pendientes = (pendientes[0] && pendientes.map(pendiente => pendiente.pendiente).reduce((a: number, b: number) => a + b)) || 0;
    });
  }

}
