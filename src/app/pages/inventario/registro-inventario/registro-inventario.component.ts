import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { InventarioOptions } from 'src/app/interfaces/inventario-options';
import { ProductoOptions } from 'src/app/interfaces/producto-options';
import { FrontService } from 'src/app/services/front.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { ConfiguracionProducto } from 'src/app/enums/configuracion-producto.enum';
import { EstadoInventario } from 'src/app/enums/estado-inventario.enum';
import { DetalleOptions } from 'src/app/interfaces/detalle-options';
import { ProductoService } from 'src/app/services/producto.service';

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
    private formBuilder: FormBuilder,
    private frontService: FrontService,
    private inventarioService: InventarioService,
    private modalController: ModalController,
    private productoService: ProductoService
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
    let estado: string;
    switch (this.tipo) {
      case ConfiguracionProducto.POLLO_ASADO:
        estado = EstadoInventario.PREPARAR_ASADO;
        break;

      case ConfiguracionProducto.POLLO_BROOSTER:
        estado = EstadoInventario.PREPARAR_BROSTEER;
        break;
    }

    let proceso: Promise<void>;
    if (estado) {
      this.producto.combos.forEach(combo => combo.activo = true);
      const detalle: DetalleOptions = { cantidad: nuevo, producto: this.producto };
      const sinPreparar = this.configuracionProducto.productos
        .find((item: any) => item.producto === ConfiguracionProducto.POLLO_SIN_PREPARAR);
      await this.inventarioService.actualizarInventario([detalle], estado, 1, sinPreparar.id);
    } else {
      await this.inventarioService.ingresoNuevos(this.producto.id, nuevo);
    }
    proceso.then(() => {
      this.modalController.dismiss();
      this.frontService.presentToast('Se ha actualizado el inventario correctamente');
    }).catch(err => {
      this.frontService.presentAlert('Ha ocurrido un error.', `Error: ${err}`, 'Se presentó un error al actualizar el inventario del producto.');
    }).finally(() => loading.dismiss());
  }

  private async presentAsingacionProducto() {
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

            await this.inventarioService.saveConfiguracion(this.configuracionProducto);
            this.idproducto = data.id;
            this.form();
          } else if (data && data.id) {
            const producto = {
              id: data.id,
              producto: this.tipo
            };
            this.configuracionProducto.productos.push(producto);
            await this.inventarioService.saveConfiguracion(this.configuracionProducto);
            this.idproducto = data.id;
            this.form();
          }
        }
      }, 'Cancelar']
    });

    alert.present();
  }

  private async updateConfiguracionProducto() {
    const configuracionProducto = (await this.inventarioService.configuracion()).data();
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
  }

  private updateInventario() {
    this.inventarioService.inventario(this.producto.id).subscribe(inventario => {
      this.inventario = inventario;
    });
  }

  public async updateProducto() {
    this.producto = (await this.productoService.producto(this.producto.id)).data() as ProductoOptions;
    this.updateInventario();
    if (this.tipo) {
      this.updateSinPreparacion();
      this.updateSubProductos();
    }
  }

  private async updateSinPreparacion() {
    const sinPreparar = this.configuracionProducto.productos
      .find((item: any) => item.producto === ConfiguracionProducto.POLLO_SIN_PREPARAR);
    if (sinPreparar) {
      const producto = (await this.productoService.producto(sinPreparar.id)).data() as ProductoOptions;
      this.sinPreparar = producto;
      this.cantidad = this.formBuilder.control('', Validators
        .compose([Validators.required, Validators.min(1), Validators.max(this.sinPreparar.cantidad)]));
    }
  }

  private async updateSubProductos() {
    const subProductos = await this.productoService.productosGrupo(this.producto.grupo.id);
    this.subProductos = subProductos.filter(producto => producto.id !== this.producto.id);
  }

}
