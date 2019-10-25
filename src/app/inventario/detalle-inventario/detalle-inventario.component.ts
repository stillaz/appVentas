import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { InventarioOptions } from 'src/app/inventario-options';
import { ProductoOptions } from 'src/app/producto-options';
import { AngularFirestore } from '@angular/fire/firestore';
import { FrontService } from 'src/app/front.service';
import { InventarioService } from 'src/app/inventario.service';
import { ModalController } from '@ionic/angular';
import { DetalleOptions } from 'src/app/detalle-options';
import { EstadoInventario } from '../../estado-inventario.enum';

@Component({
  selector: 'app-detalle-inventario',
  templateUrl: './detalle-inventario.component.html',
  styleUrls: ['./detalle-inventario.component.scss'],
})
export class DetalleInventarioComponent implements OnInit {

  public cantidad: FormControl;
  public idproducto: string;
  public inventario: InventarioOptions[];
  public producto: ProductoOptions;
  public sinPreparar: ProductoOptions;
  public subProductos: ProductoOptions[];

  constructor(
    private angularFirestore: AngularFirestore,
    private formBuilder: FormBuilder,
    private frontService: FrontService,
    private inventarioService: InventarioService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.updateProducto();
    if (this.idproducto !== '01' && this.idproducto !== '04') {
      this.cantidad = this.formBuilder
        .control('', Validators.compose([Validators.required, Validators.min(1), Validators.max(1000)]));
    }
  }

  public cerrar() {
    this.modalController.dismiss();
  }

  public async guardar() {
    const loading = await this.frontService.presentLoading('Actualizando inventario...');
    const nuevo = Number(this.cantidad.value);
    const batch = this.angularFirestore.firestore.batch();
    if (this.idproducto === '01' || this.idproducto === '04') {
      const estado = this.idproducto === '01' ? EstadoInventario.PREPARAR_ASADO : EstadoInventario.PREPARAR_BROSTEER;
      this.producto.combos.forEach(combo => combo.activo = true);
      const detalle: DetalleOptions = { cantidad: nuevo, producto: this.producto };
      await this.inventarioService.actualizarInventario([detalle], batch, estado, 1, true);
    } else {
      await this.inventarioService.ingresoNuevos(this.producto, nuevo, batch);
    }
    batch.commit().then(() => {
      this.modalController.dismiss();
      this.frontService.presentToast('Se ha actualizado el inventario correctamente');
    }).catch(err => {
      this.frontService.presentAlert('Ha ocurrido un error.', `Error: ${err}`, 'Se presentó un error al actualizar el inventario del producto.');
    }).finally(() => loading.dismiss());
  }

  private updateInventario() {
    const inventarioCollection = this.angularFirestore
      .collection<InventarioOptions>(`productos/${this.idproducto}/inventario`, ref => ref.orderBy('fecha', 'desc').limit(10));
    inventarioCollection.valueChanges().subscribe(inventario => {
      this.inventario = inventario;
    })
  }

  public updateProducto() {
    const productoDocument = this.angularFirestore.doc<ProductoOptions>(`productos/${this.idproducto}`);
    productoDocument.valueChanges().subscribe(producto => {
      this.producto = producto;
      this.updateInventario();

      if (this.idproducto === '01' || this.idproducto === '04') {
        this.updateSinPreparacion();
        this.updateSubProductos();
      }
    });
  }

  private updateSinPreparacion() {
    const productoDocument = this.angularFirestore.doc<ProductoOptions>('productos/00');
    productoDocument.valueChanges().subscribe(producto => {
      this.sinPreparar = producto;
      this.cantidad = this.formBuilder
        .control('', Validators.compose([Validators.required, Validators.min(1), Validators.max(this.sinPreparar.cantidad)]));
    });
  }

  private updateSubProductos() {
    const productosCollection = this.angularFirestore.collection<ProductoOptions>('productos', ref => ref.where('grupo.id', '==', this.producto.grupo.id));
    productosCollection.valueChanges().subscribe(productos => {
      this.subProductos = productos.filter(producto => producto.id !== this.producto.id);
    });
  }


}
