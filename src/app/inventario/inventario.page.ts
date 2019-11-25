import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import moment from 'moment';
import { NavController, PopoverController } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {

  public productos: any[];

  constructor(
    private angularFirestore: AngularFirestore,
    private navController: NavController,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.updateInventario();
  }

  public async menu(ev: any) {
    const popover = await this.popoverController.create({
      component: MenuComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  private updateInventario() {
    const productosCollection = this.angularFirestore.collection<any>('productos', ref => ref.where('maneja_inventario', '==', true));
    productosCollection.valueChanges().subscribe(productos => {
      this.productos = productos;
      this.productos.forEach(producto => {
        if (producto.fechainventario) {
          producto.actualizacion = moment(producto.fechainventario.toDate()).locale('es').calendar()
        }
      });
    });
  }

  public ver(producto: string) {
    this.navController.navigateForward(`inventario/detalle/${producto}`);
  }

}
