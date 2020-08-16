import { Component, OnInit } from '@angular/core';
import { CajaOptions } from 'src/app/interfaces/caja-options';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { CajaService } from 'src/app/services/caja.service';
import { FrontService } from 'src/app/services/front.service';
import { Router } from '@angular/router';
import { MenuCajaComponent } from './menu-caja/menu-caja.component';

@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.page.html',
  styleUrls: ['./cajas.page.scss'],
})
export class CajasPage implements OnInit {

  administracion: boolean;
  caja: CajaOptions;
  cajas: CajaOptions[];
  movimiento: CajaOptions;
  movimientos: CajaOptions[];

  constructor(
    private alertController: AlertController,
    private cajaService: CajaService,
    private frontService: FrontService,
    private navController: NavController,
    private popoverController: PopoverController,
    private router: Router
  ) { }

  ngOnInit() {
    this.administracion = this.router.url.startsWith('/configuracion');
    if (!this.administracion) {
      this.caja = this.cajaService.caja;
      this.updateMovimientos();
    } else {
      this.updateCajas();
    }
  }

  async menu(ev: any) {
    const popover = await this.popoverController.create({
      component: MenuCajaComponent,
      event: ev,
      translucent: true
    });

    popover.onDidDismiss().then(() => {
      this.updateCaja(this.caja.id);
    });

    popover.present();
  }

  private async registrarCaja(id: string) {
    await this.cajaService.registrarCaja(id);
    this.updateCaja(id);
    this.frontService.presentToast(`La caja ${id} ha sido registrada`);
    this.navController.navigateBack('home');
  }

  private updateCaja(id: string) {
    this.cajaService.load(id).then(caja => {
      this.caja = caja;
      this.updateMovimientos();
    });
  }

  private async updateCajas() {
    this.cajaService.cajas().subscribe(cajas => {
      this.cajas = cajas;
    });
  }

  private updateMovimientos() {
    if (this.caja && this.caja.movimiento) {
      this.cajaService.movimientos(this.caja.id, this.caja.movimiento).then(movimientos => {
        this.movimientos = movimientos;
      });
    }
  }

  async ver(caja?: string) {
    if (!caja) {
      const alert = await this.alertController.create({
        header: 'Registro de caja',
        message: 'Ingresa el id de la caja',
        inputs: [{
          name: 'caja',
          type: 'text'
        }],
        buttons: [{
          text: 'Aceptar',
          handler: data => {
            if (data && data.caja) {
              this.registrarCaja(data.caja);
            }
          }
        }, 'Cancelar']
      });

      alert.present();
    } else {
      this.updateCaja(caja);
      this.navController.navigateForward('caja');
    }
  }

}
