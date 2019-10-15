import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import moment from 'moment';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {

  public productos: any[];

  constructor(
    private angularFirestore: AngularFirestore,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.updateInventario();
  }

  private updateInventario() {
    const productosCollection = this.angularFirestore.collection<any>('productos');
    productosCollection.valueChanges().subscribe(productos => {
      this.productos = productos;
      this.productos.forEach(producto => producto.actualizacion = moment(producto.fechainventario.toDate()).locale('es').calendar());
    });
  }

  public ver(producto: string) {
    this.navController.navigateForward(`inventario/detalle/${producto}`);
  }

}
