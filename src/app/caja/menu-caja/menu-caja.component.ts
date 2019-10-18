import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { DetalleCajaComponent } from '../detalle-caja/detalle-caja.component';
import { CajaService } from 'src/app/caja.service';
import { CajaOptions } from 'src/app/caja-options';

@Component({
  selector: 'app-menu-caja',
  templateUrl: './menu-caja.component.html',
  styleUrls: ['./menu-caja.component.scss'],
})
export class MenuCajaComponent implements OnInit {

  public movimiento: CajaOptions;

  constructor(
    private modalController: ModalController,
    private popoverController: PopoverController,
    private cajaService: CajaService
  ) { }

  ngOnInit() {
    this.movimiento = this.cajaService.movimiento;
  }

  public async ejecutar(opcion: string) {
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: DetalleCajaComponent,
      componentProps: {
        opcion
      }
    });

    modal.present();
  }
}
