import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController, NavController } from '@ionic/angular';
import { DetalleInventarioComponent } from 'src/app/inventario/detalle-inventario/detalle-inventario.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private popoverController: PopoverController) { }

  ngOnInit() { }

  public async inventario(producto: string) {
    const modal = await this.modalController.create({
      component: DetalleInventarioComponent,
      componentProps: {
        idproducto: producto
      }
    });

    await modal.present();
    this.popoverController.dismiss();
  }

  public async reporte() {
    this.navController.navigateForward('inventario');
    this.popoverController.dismiss();
  }
}
