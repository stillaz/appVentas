import { Component } from '@angular/core';
import { CajaOptions } from '../interfaces/caja-options';
import { AlertController, MenuController, ModalController, NavController, LoadingController } from '@ionic/angular';
import { CajaService } from '../services/caja.service';
import { FrontService } from '../services/front.service';
import { EstadoCaja } from '../enums/estado-caja.enum';
import { LoginService } from '../services/login.service';
import { DetalleCajaComponent } from '../pages/cajas/detalle-caja/detalle-caja.component';
import moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  caja: CajaOptions;
  inicio = true;

  constructor(
    private alertController: AlertController,
    private cajaService: CajaService,
    private frontService: FrontService,
    private loginService: LoginService,
    private loadingController: LoadingController,
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

  ir(pagina: string) {
    if (pagina === 'venta/registro' && (!this.caja || this.caja.estado !== EstadoCaja.ABIERTA)) {
      this.frontService.presentAlert('Caja sin abrir', 'La caja no se encuentra abierta', 'Debes abrir la caja antes de registrar ventas.')
    } else if (pagina === 'caja' && !this.caja) {
      this.frontService.presentAlert('Caja', 'No tiene alguna caja registrada en el sistema', 'Registra una caja para poder realizar ventas.');
      this.navController.navigateForward(`configuracion/cajas`);
    } else {
      this.navController.navigateForward(`${pagina}`);
    }
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
            this.loginService.logout();
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
      this.loginService.logout();
    }
  }

  private async validateCaja() {
    const loading = await this.loadingController.create({
      message: 'Iniciando caja...',
      duration: 20000
    });

    loading.present();

    this.cajaService.cajas().subscribe(cajas => {
      if (this.loginService.currentUser && cajas[0]) {
        this.caja = cajas[0];
        this.cajaService.caja = this.caja;
        if (this.inicio && !this.caja.estado) {
          this.presentAlert('Sin caja', '¿Desea abrir caja?', this.caja, 'Inicio');
        } else if (this.inicio && (this.caja.estado === EstadoCaja.CERRADA || this.caja.estado === EstadoCaja.DESCUADRE)) {
          this.presentAlert('Inicio de caja', '¿Desea abrir caja?', this.caja, 'Apertura');
        } else if (this.inicio) {
          const idfecha = moment(this.caja.fecha.toDate()).locale('es').format('LLLL');
          this.presentAlert('Caja abierta', '¿Desea cerrar caja?', this.caja, 'Cierre', `La caja de ${idfecha} se encuentra abierta.`);
        }
        this.inicio = false;
      } else if (!cajas[0]) {
        this.frontService.presentAlert('Caja', 'No tiene alguna caja registrada en el sistema', 'Registra una caja.');
      } else {
        this.validateCaja();
      }

      loading.dismiss();
    });
  }

}
