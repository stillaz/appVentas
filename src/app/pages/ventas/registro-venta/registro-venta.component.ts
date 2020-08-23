import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, ToastController, MenuController, ActionSheetController, LoadingController } from '@ionic/angular';
import { VentaOptions } from 'src/app/interfaces/venta-options';
import { VentaService } from 'src/app/services/venta.service';
import { DetalleClienteComponent } from '../detalle-cliente/detalle-cliente.component';
import { PedidoService } from 'src/app/services/pedido.service';
import { PagoComponent } from '../pago/pago.component';

@Component({
  selector: 'app-registro-venta',
  templateUrl: './registro-venta.component.html',
  styleUrls: ['./registro-venta.component.scss'],
})
export class RegistroVentaComponent implements OnInit {

  venta: VentaOptions;

  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private menuController: MenuController,
    private modalController: ModalController,
    private navController: NavController,
    private pedidoService: PedidoService,
    private toastController: ToastController,
    private ventaService: VentaService
  ) { }

  ngOnInit() {
    this.menuController.enable(false, 'home');
    this.menuController.enable(true, 'carrito');
    this.pedidoService.nuevaVenta();
    this.venta = this.pedidoService.venta;
  }

  async cancelar() {
    const alert = await this.alertController.create({
      header: 'Cancelar venta',
      message: `¿Desea cancelar la venta?`,
      buttons: [{
        text: 'Si',
        handler: () => {
          this.navController.navigateBack('home');
        }
      }, {
        text: 'No',
        role: 'cancel'
      }]
    });
    await alert.present();
  }

  private async domicilio() {
    const modal = await this.modalController.create({
      component: DetalleClienteComponent
    });

    modal.onDidDismiss().then(res => {
      if (res.data) {
        this.venta.domicilio = res.data.cliente;
        this.domicilioCosto();
      }
    });

    modal.present();
  }

  private async domicilioCosto() {
    const alert = await this.alertController.create({
      header: 'Valor de domicilio',
      message: 'Ingrese el valor del domicilio',
      inputs: [{
        min: 0,
        max: 99999,
        name: 'domicilio',
        type: 'number',
        value: 0
      }],
      buttons: [{
        text: 'Aceptar',
        handler: (data) => {
          this.venta.valordomicilio = Number(data.domicilio);
          this.venta.total = this.venta.total + this.venta.valordomicilio;
          this.pago();
        }
      }]
    });

    alert.present();
  }

  private async pago() {
    const modal = await this.modalController.create({
      component: PagoComponent,
      componentProps: {
        venta: this.venta
      }
    });

    modal.onDidDismiss().then(res => {
      if (res.data) {
        this.venta = res.data;
        this.pendiente();
      }
    });

    modal.present();
  }

  private async pendiente() {
    const loading = await this.loadingController.create({
      message: 'Registrando venta...'
    });

    loading.present();

    this.ventaService.pendiente(this.venta).then(async () => {
      this.presentAlertFinalizar();
    }).catch(err => {
      this.presentAlertError(err, 'registrar');
    }).finally(() => loading.dismiss());
  }

  private async presentAlertError(err: any, tipo: string) {
    const alert = await this.alertController.create({
      header: 'Ha ocurrido un error',
      subHeader: `Se presentó un error al ${tipo} la venta.`,
      message: `Error: ${err}`,
      buttons: ['OK']
    });

    alert.present();
  }

  private async presentAlertFinalizar() {
    const alert = await this.alertController.create({
      header: `Venta ${this.venta.id}`,
      subHeader: `Turno ${this.venta.turno}`,
      buttons: [{
        text: 'Continuar',
        handler: () => {
          this.navController.navigateBack('home');
          this.presentToast('Se ha registrado la venta');
        }
      }]
    });
    return await alert.present();
  }

  private async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

  async quitar(idproducto: string, nombre: string, cantidad: number) {
    const alert = await this.alertController.create({
      header: 'Quitar ítem',
      message: `¿Desea quitar ${cantidad} ${nombre}?`,
      buttons: [{
        text: 'Si',
        handler: () => {
          this.pedidoService.quitar(idproducto);
        }
      }, 'No']
    });

    await alert.present();
  }

  async registrar() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciona servicio',
      buttons: [{
        icon: 'send-outline',
        text: 'Entrega a domicilio',
        handler: () => {
          this.domicilio();
        }
      }, {
        icon: 'pin-outline',
        text: 'Entrega en sitio',
        handler: () => {
          this.pendiente();
        }
      }]
    });

    await actionSheet.present();
  }

}
