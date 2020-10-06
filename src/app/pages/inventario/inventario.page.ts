import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { MenuInventarioComponent } from './menu-inventario/menu-inventario.component';
import { ProductoService } from 'src/app/services/producto.service';
import moment from 'moment';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {

  public productos: any[];

  constructor(
    private navController: NavController,
    private popoverController: PopoverController,
    private productoService: ProductoService
  ) { }

  ngOnInit() {
    this.updateInventario();
  }

  public async menu(ev: any) {
    const popover = await this.popoverController.create({
      component: MenuInventarioComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  private updateInventario() {
    this.productoService.productosInventario().subscribe(productos => {
      this.productos = productos;
    });
  }

  public ver(producto: string) {
    this.navController.navigateForward(`inventario/detalle/${producto}`);
  }

}
