import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { DetalleCajaComponent } from '../detalle-caja/detalle-caja.component';

@Component({
  selector: 'app-menu-caja',
  templateUrl: './menu-caja.component.html',
  styleUrls: ['./menu-caja.component.scss'],
})
export class MenuCajaComponent implements OnInit {

  constructor(
    private modalController: ModalController,
    private popoverController: PopoverController
  ) { }

  ngOnInit() { }

  public async cerrar(caja: string) {
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: DetalleCajaComponent,
      componentProps: {
        caja,
        opcion: 'Cierre'
      }
    });

    modal.present();
  }
}
