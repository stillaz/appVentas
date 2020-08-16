import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { isNumber } from 'util';
import { CajaOptions } from 'src/app/interfaces/caja-options';
import { AlertController, ModalController } from '@ionic/angular';
import { CajaService } from 'src/app/services/caja.service';
import { FrontService } from 'src/app/services/front.service';
import { LoginService } from 'src/app/services/login.service';
import { MensajeComponent } from '../mensaje/mensaje.component';
import { EstadoMovimiento } from 'src/app/enums/estado-movimiento.enum';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-detalle-caja',
  templateUrl: './detalle-caja.component.html',
  styleUrls: ['./detalle-caja.component.scss'],
})
export class DetalleCajaComponent implements OnInit {

  caja: CajaOptions;
  entrada: FormControl;
  movimientos: any[];
  opcion: string;

  constructor(
    private alertController: AlertController,
    private cajaService: CajaService,
    private dataService: DataService,
    private frontService: FrontService,
    private loginService: LoginService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.caja = this.cajaService.caja;
    this.entrada = new FormControl(null, Validators.compose([Validators.required, Validators.min(0), this.maximo()]));
    this.updateMovimientos();
  }

  cerrar() {
    this.modalController.dismiss();
  }

  async guardar() {
    let titulo: string;
    const entradaValue = this.entrada.value;
    const entrada = !isNumber(entradaValue) ? parseInt(entradaValue.replace(/[^\d]/g, "")) : entradaValue;
    if (this.opcion === 'Cierre' && Number(this.caja.total) !== entrada) {
      titulo = 'Descuadre de caja';
      const alert = await this.alertController.create({
        header: titulo,
        subHeader: 'El valor total en caja no coincide con el valor ingresado en el cierre.',
        message: '¿Desea continuar con los valores descuadrados en caja?',
        buttons: [{
          text: 'Si',
          handler: () => {
            this.presentMensaje(titulo, entrada);
          }
        }, 'No']
      });

      alert.present();
    } else if (this.opcion === 'Retiro') {
      titulo = 'Retiro de caja';
      const alert = await this.alertController.create({
        header: titulo,
        message: `¿Está seguro retirar ${entrada} de la caja?`,
        buttons: [{
          text: 'Si',
          handler: () => {
            this.presentMensaje(titulo, entrada);
          }
        }, 'No']
      });

      alert.present();
    } else {
      this.procesarCaja(entrada, null);
    }
  }

  private maximo(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (Validators.required(control)) return null;
      const entrada = control.value;
      const valor = !isNumber(entrada) ? parseInt(entrada.replace(/[^\d]/g, "")) : entrada;
      const max = this.opcion === 'Retiro' && Number(this.caja.total);
      if (max && max < valor) {
        return { max: true };
      }
      return null;
    }
  }

  private async presentMensaje(mensaje: string, entrada: number) {
    const modal = await this.modalController.create({
      component: MensajeComponent,
      componentProps: {
        titulo: mensaje
      }
    });

    modal.onDidDismiss().then(res => {
      if (res && res.data) {
        this.procesarCaja(entrada, res.data, true);
      }
    });

    modal.present();
  }

  private async procesarCaja(entrada: number, mensaje: string, descuadre?: boolean) {
    const loading = await this.frontService.presentLoading('Procesando...');
    const usuario = this.loginService.usuario;
    this.cajaService.registrarMovimientoCaja(this.caja.id, entrada, this.opcion, usuario, descuadre, mensaje).then(() => {
      loading.dismiss();
      this.modalController.dismiss();
      if (this.opcion === EstadoMovimiento.CIERRE_CAJA) {
        this.loginService.logout();
      } else {
        this.frontService.presentToast('Se ha realizado la apertura de la caja');
      }
    }).catch(err => {
      loading.dismiss();
      this.frontService.presentAlert('Ha ocurrido un error', `Error: ${err}`, 'Se presentó al abrir caja.')
    });
  }

  private updateMovimientos() {
    this.cajaService.movimientos(this.caja.id, this.caja.movimiento).then(movimientos => {
      this.movimientos = this.dataService.agruparCampo(movimientos, 'estado');
    });
  }

}
