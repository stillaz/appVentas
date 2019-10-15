import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import moment from 'moment';
import { EstadoCaja } from '../estado-caja.enum';
import { AlertController, ModalController } from '@ionic/angular';
import { FrontService } from '../front.service';
import { CajaOptions } from '../caja-options';
import { DetalleCajaComponent } from '../caja/detalle-caja/detalle-caja.component';

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
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.updatePendientes();
    this.updateCaja();
  }

  private loadCaja() {
    const fecha = new Date();
    const idfecha = moment(fecha).startOf('day').toDate().getTime();
    const cajaCollection = this.angularFirestore.collection<CajaOptions>(`ventas`, ref => ref.orderBy('fecha', 'desc').limit(1));
    return new Promise<CajaOptions>(resolve => {
      cajaCollection.valueChanges().subscribe(caja => {
        resolve(caja[0]);
      });
    });
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

  private updateCaja() {
    const fecha = new Date();
    const idfecha = moment(fecha).startOf('day').toDate().getTime();
    const cajaCollection = this.angularFirestore.collection<CajaOptions>(`ventas/${idfecha}/caja`, ref => ref.orderBy('fecha', 'desc').limit(1));
    cajaCollection.valueChanges().subscribe(caja => {
      const ultimacaja = caja[0];
      if (!ultimacaja) {
        this.presentAlert('Sin caja', '¿Desea abrir caja?');
      } else if (ultimacaja.estado === EstadoCaja.CERRADA) {
        this.presentAlert('Inicio de caja', '¿Desea abrir caja?', ultimacaja);
      } else {
        this.presentAlert('Caja abierta', '¿Desea cerrar caja?', ultimacaja, `La caja de ${fecha} se encuentra abierta.`);
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
