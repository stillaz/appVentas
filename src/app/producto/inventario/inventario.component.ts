import { Component, OnInit } from '@angular/core';
import { ProductoOptions } from 'src/app/producto-options';
import { AngularFirestore } from '@angular/fire/firestore';
import { InventarioOptions } from 'src/app/inventario-options';
import { ModalController } from '@ionic/angular';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { FrontService } from 'src/app/front.service';
import { InventarioService } from 'src/app/inventario.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss'],
})
export class InventarioComponent implements OnInit {

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
    let servicio: Promise<any>;
    if (this.idproducto === '01' || this.idproducto === '04') {
      servicio = this.inventarioService.registroProductoPreparacion(this.producto, nuevo, this.sinPreparar, this.subProductos);
    } else {
      servicio = this.inventarioService.ingresoNuevos(this.producto, nuevo);
    }
    servicio.then(() => {
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

  private updateProducto() {
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
