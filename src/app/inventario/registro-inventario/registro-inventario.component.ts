import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { InventarioOptions } from 'src/app/inventario-options';
import { ProductoOptions } from 'src/app/producto-options';
import { AngularFirestore } from '@angular/fire/firestore';
import { FrontService } from 'src/app/front.service';
import { InventarioService } from 'src/app/inventario.service';
import { ModalController, AlertController } from '@ionic/angular';
import { EstadoInventario } from 'src/app/estado-inventario.enum';
import { DetalleOptions } from 'src/app/detalle-options';
import { ConfiguracionProducto } from 'src/app/configuracion-producto.enum';

@Component({
  selector: 'app-registro-inventario',
  templateUrl: './registro-inventario.component.html',
  styleUrls: ['./registro-inventario.component.scss'],
})
export class RegistroInventarioComponent implements OnInit {

  public cantidad: FormControl;
  public configuracionProducto: any;
  public idproducto: string;
  public inventario: InventarioOptions[];
  public producto: ProductoOptions;
  public sinPreparar: ProductoOptions;
  public subProductos: ProductoOptions[];
  public tipo: string;

  constructor(
    private alertController: AlertController,
    private angularFirestore: AngularFirestore,
    private formBuilder: FormBuilder,
    private frontService: FrontService,
    private inventarioService: InventarioService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    if (this.tipo) {
      this.updateConfiguracionProducto();
    } else if (this.producto) {
      this.form();
    }
  }

  public cerrar() {
    this.modalController.dismiss();
  }

  public form() {
    this.updateProducto();
    if (!this.tipo) {
      this.cantidad = this.formBuilder
        .control('', Validators.compose([Validators.required, Validators.min(1), Validators.max(10000)]));
    }
  }

  public async guardar() {
    const loading = await this.frontService.presentLoading('Actualizando inventario...');
    const nuevo = Number(this.cantidad.value);
    const batch = this.angularFirestore.firestore.batch();
    if (this.tipo === ConfiguracionProducto.POLLO_ASADO
      || this.tipo === ConfiguracionProducto.POLLO_BROOSTER) {
      const estado = this.tipo === ConfiguracionProducto.POLLO_ASADO ? EstadoInventario.PREPARAR_ASADO : EstadoInventario.PREPARAR_BROSTEER;
      this.producto.combos.forEach(combo => combo.activo = true);
      const detalle: DetalleOptions = { cantidad: nuevo, producto: this.producto };
      const sinPreparar = this.configuracionProducto.productos
        .find((item: any) => item.producto === ConfiguracionProducto.POLLO_SIN_PREPARAR);
      await this.inventarioService.actualizarInventario([detalle], batch, estado, 1, sinPreparar.id);
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

  private async presentAsingacionProducto() {
    const configuracionProductoDocument = this.angularFirestore.doc<any>('configuracion/producto');
    const alert = await this.alertController.create({
      header: `${this.tipo} sin asignar`,
      message: `El producto: ${this.tipo} no tiene un código asignado`,
      subHeader: `Selecciona el código para ${this.tipo}`,
      inputs: [{
        name: 'id',
        type: 'text'
      }],
      buttons: [{
        text: 'Aceptar',
        handler: async data => {
          if (data && data.id && !this.configuracionProducto) {
            this.configuracionProducto = {
              actualizacion: new Date(),
              productos: []
            };

            this.configuracionProducto.productos.push({
              id: data.id,
              producto: this.tipo
            });

            await configuracionProductoDocument.set(this.configuracionProducto);
            this.idproducto = data.id;
            this.form();
          } else if (data && data.id) {
            const producto = {
              id: data.id,
              producto: this.tipo
            };
            this.configuracionProducto.productos.push(producto);
            await configuracionProductoDocument.update(this.configuracionProducto);
            this.idproducto = data.id;
            this.form();
          }
        }
      }, 'Cancelar']
    });

    alert.present();
  }

  private updateConfiguracionProducto() {
    const configuracionProductoDocument = this.angularFirestore.doc<any>('configuracion/producto');
    configuracionProductoDocument.valueChanges().subscribe(async configuracionProducto => {
      this.configuracionProducto = configuracionProducto;
      if (!configuracionProducto || !configuracionProducto.productos) {
        this.presentAsingacionProducto();
      } else {
        const producto = configuracionProducto.productos.find((item: any) => item.producto === this.tipo);
        if (!producto) {
          this.presentAsingacionProducto();
        } else {
          this.idproducto = producto.id;
          this.form();
        }
      }
    });
  }

  private updateInventario() {
    const inventarioCollection = this.angularFirestore
      .collection<InventarioOptions>(`productos/${this.idproducto}/inventario`, ref => ref
        .orderBy('fecha', 'desc').limit(10));
    inventarioCollection.valueChanges().subscribe(inventario => {
      this.inventario = inventario;
    })
  }

  public updateProducto() {
    const productoDocument = this.angularFirestore.doc<ProductoOptions>(`productos/${this.idproducto}`);
    productoDocument.valueChanges().subscribe(producto => {
      this.producto = producto;
      this.updateInventario();
      if (this.tipo === ConfiguracionProducto.POLLO_ASADO
        || this.tipo === ConfiguracionProducto.POLLO_BROOSTER) {
        this.updateSinPreparacion();
        this.updateSubProductos();
      }
    });
  }

  private updateSinPreparacion() {
    const sinPreparar = this.configuracionProducto.productos
      .find((item: any) => item.producto === ConfiguracionProducto.POLLO_SIN_PREPARAR);
    if (sinPreparar) {
      const productoDocument = this.angularFirestore.doc<ProductoOptions>(`productos/${sinPreparar.id}`);
      productoDocument.valueChanges().subscribe(producto => {
        this.sinPreparar = producto;
        this.cantidad = this.formBuilder
          .control('', Validators
            .compose([Validators.required, Validators.min(1), Validators.max(this.sinPreparar.cantidad)]));
      });
    }
  }

  private updateSubProductos() {
    const productosCollection = this.angularFirestore
      .collection<ProductoOptions>('productos', ref => ref.where('grupo.id', '==', this.producto.grupo.id));
    productosCollection.valueChanges().subscribe(productos => {
      this.subProductos = productos.filter(producto => producto.id !== this.producto.id);
    });
  }

}
