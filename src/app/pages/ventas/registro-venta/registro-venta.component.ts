import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, ToastController, MenuController } from '@ionic/angular';
import { VentaOptions } from 'src/app/interfaces/venta-options';
import { VentaService } from 'src/app/services/venta.service';
import { PagoComponent } from '../pago/pago.component';
import { DetalleClienteComponent } from '../detalle-cliente/detalle-cliente.component';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-registro-venta',
  templateUrl: './registro-venta.component.html',
  styleUrls: ['./registro-venta.component.scss'],
})
export class RegistroVentaComponent implements OnInit {

  venta: VentaOptions;

  constructor(
    private alertController: AlertController,
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
      subHeader: `¿Desea cancelar la venta?`,
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

  async domicilio() {
    const modal = await this.modalController.create({
      component: DetalleClienteComponent
    });

    modal.onDidDismiss().then(res => {
      if (res.data) {
        this.venta.domicilio = res.data.cliente;
        this.pendiente();
      }
    });

    modal.present();
  }

  pendiente() {
    this.ventaService.pendiente(this.venta).then(() => {
      this.presentAlertFinalizar();
    }).catch(err => {
      this.presentAlertError(err, 'registrar');
    });
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

  async terminar() {
    const modal = await this.modalController.create({
      component: PagoComponent,
      componentProps: {
        venta: this.venta
      }
    });

    modal.present();
  }


}
