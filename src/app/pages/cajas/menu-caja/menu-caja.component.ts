import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { CajaOptions } from 'src/app/interfaces/caja-options';
import { CajaService } from 'src/app/services/caja.service';
import { DetalleCajaComponent } from '../detalle-caja/detalle-caja.component';

@Component({
  selector: 'app-menu-caja',
  templateUrl: './menu-caja.component.html',
  styleUrls: ['./menu-caja.component.scss'],
})
export class MenuCajaComponent implements OnInit {

  caja: CajaOptions;

  constructor(
    private modalController: ModalController,
    private popoverController: PopoverController,
    private cajaService: CajaService
  ) { }

  ngOnInit() {
    this.caja = this.cajaService.caja;
  }

  public async ejecutar(opcion: string) {
    const modal = await this.modalController.create({
      component: DetalleCajaComponent,
      componentProps: {
        opcion
      }
    });

    modal.onDidDismiss().then(() => {
      this.popoverController.dismiss();
    })

    modal.present();
  }
}
