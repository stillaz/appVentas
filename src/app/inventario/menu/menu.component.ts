import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { RegistroInventarioComponent } from '../registro-inventario/registro-inventario.component';
import { ConfiguracionProducto } from '../../configuracion-producto.enum';

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
    let tipo: string;
    switch (producto) {
      case 'a':
        tipo = ConfiguracionProducto.POLLO_SIN_PREPARAR;
        break;

      case 'b':
        tipo = ConfiguracionProducto.POLLO_ASADO;
        break;

      case 'c':
        tipo = ConfiguracionProducto.POLLO_BROOSTER;
        break;
    }
    const modal = await this.modalController.create({
      component: RegistroInventarioComponent,
      componentProps: {
        idproducto: producto,
        tipo: tipo
      }
    });

    await modal.present();
    this.popoverController.dismiss();
  }
}
