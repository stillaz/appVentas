import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { RegistroInventarioComponent } from '../registro-inventario/registro-inventario.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(
    private modalController: ModalController,
    private popoverController: PopoverController) { }

  ngOnInit() { }

  public async inventario(producto?: string) {
    const modal = await this.modalController.create({
      component: RegistroInventarioComponent,
      componentProps: {
        idproducto: producto
      }
    });

    await modal.present();
    this.popoverController.dismiss();
  }
}
