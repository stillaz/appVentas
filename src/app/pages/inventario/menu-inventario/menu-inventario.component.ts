import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { ConfiguracionProducto } from 'src/app/enums/configuracion-producto.enum';
import { RegistroInventarioComponent } from '../registro-inventario/registro-inventario.component';

@Component({
  selector: 'app-menu-inventario',
  templateUrl: './menu-inventario.component.html',
  styleUrls: ['./menu-inventario.component.scss'],
})
export class MenuInventarioComponent implements OnInit {

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
