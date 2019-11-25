import { Component } from '@angular/core';
import { AlertController, ModalController, NavController, MenuController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { CajaService } from '../caja.service';
import { FrontService } from '../front.service';
import { EstadoCaja } from '../estado-caja.enum';
import { CajaOptions } from '../caja-options';
import { DetalleCajaComponent } from '../caja/detalle-caja/detalle-caja.component';
import moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public caja: CajaOptions;

  constructor(
    private alertController: AlertController,
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private cajaService: CajaService,
    private frontService: FrontService,
    private menuController: MenuController,
    private modalController: ModalController,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.validateCaja();
  }

  ionViewDidEnter() {
    this.menuController.enable(true, 'home');
  }

  public ir(pagina: string) {
    this.caja = this.cajaService.caja;
    if (pagina === 'venta/registro' && (!this.caja || this.caja.estado !== EstadoCaja.ABIERTA)) {
      this.frontService.presentAlert('Caja sin abrir', 'La caja no se encuentra abierta', 'Debes abrir la caja antes de registrar ventas.')
    } else if (pagina === 'caja' && !this.caja) {
      this.frontService.presentAlert('Caja', 'No tiene alguna caja registrada en el sistema', 'Registra una caja para poder realizar ventas.');
      this.navController.navigateForward(`configuracion/${pagina}`);
    } else {
      this.navController.navigateForward(`${pagina}`);
    }
  }

  private loadCaja() {
    const cajaCollection = this.angularFirestore.collection<CajaOptions>('cajas');
    return new Promise<CajaOptions[]>(resolve => {
      cajaCollection.valueChanges().subscribe(cajas => {
        resolve(cajas);
      });
    })
  }

  private async presentAlert(titulo: string, mensaje: string, caja: CajaOptions, opcion: string, subtitulo?: string, salir?: boolean) {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      buttons: [{
        text: 'Si',
        handler: () => {
          this.presentRegistroCaja(caja && caja.id, opcion);
        }
      }, {
        text: 'No',
        handler: () => {
          if (salir) {
            this.angularFireAuth.auth.signOut();
          }
        }
      }]
    });

    alert.present();
  }

  private async presentRegistroCaja(caja: string, opcion: string) {
    const modal = await this.modalController.create({
      component: DetalleCajaComponent,
      componentProps: {
        caja,
        opcion
      }
    });

    modal.present();
  }

  public salir() {
    const caja = this.cajaService.caja;
    if (caja && caja.estado === EstadoCaja.ABIERTA) {
      const idfecha = moment(caja.fecha.toDate()).locale('es').format('LLLL');
      this.presentAlert('Caja abierta', '¿Desea cerrar caja?', caja, 'Cierre', `La caja de ${idfecha} se encuentra abierta.`, true);
    } else {
      this.angularFireAuth.auth.signOut();
    }
  }

  private async validateCaja() {
    const cajas = await this.loadCaja();
    if (this.angularFireAuth.auth.currentUser && cajas.length === 1) {
      const caja = cajas[0];
      this.cajaService.updateCaja(caja.id);
      const estadocaja = caja.estado;
      if (!estadocaja) {
        this.presentAlert('Sin caja', '¿Desea abrir caja?', caja, 'Inicio');
      } else if (estadocaja === EstadoCaja.CERRADA || estadocaja === EstadoCaja.DESCUADRE) {
        this.presentAlert('Inicio de caja', '¿Desea abrir caja?', caja, 'Apertura');
      } else {
        const idfecha = moment(caja.fecha.toDate()).locale('es').format('LLLL');
        this.presentAlert('Caja abierta', '¿Desea cerrar caja?', caja, 'Cierre', `La caja de ${idfecha} se encuentra abierta.`);
      }
    } else {
      const subscribe = this.angularFireAuth.authState.subscribe();
      this.validateCaja();
      subscribe.unsubscribe();
    }
  }

}
