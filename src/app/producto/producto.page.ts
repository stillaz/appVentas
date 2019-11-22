import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController, Platform } from '@ionic/angular';
import { ProductoOptions } from '../producto-options';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { GrupoOptions } from '../grupo-options';
import { Router } from '@angular/router';
import { CompraService } from '../compra.service';
import { VentaOptions } from '../venta-options';
import { GrupoService } from '../grupo.service';
import { FrontService } from '../front.service';
import { DetalleProductoComponent } from './detalle-producto/detalle-producto.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {

  public agrupar: boolean;
  public mobile: boolean;
  public busqueda: string = '';
  public cantidad: number;
  public carrito: VentaOptions;
  public filtro: string;
  public grupos: GrupoOptions[];
  public gruposProducto: any[];
  public gruposeleccion: string;
  public marcaseleccion: string;
  public mensaje = true;
  public modo = 'dos';
  public productos: ProductoOptions[];
  public ventas: boolean;

  public pages: any[] = [
    { title: 'Productos más vendidos', component: '', icon: 'trending-up' },
    { title: 'Productos menos vendidos', component: '', icon: 'trending-down' },
    { title: 'Histórico inventario', component: '', icon: 'list-box' }
  ];

  constructor(
    private actionSheetController: ActionSheetController,
    private angularFirestore: AngularFirestore,
    private compraService: CompraService,
    private fronService: FrontService,
    private grupoService: GrupoService,
    private modalController: ModalController,
    private platform: Platform,
    private router: Router
  ) { }

  ngOnInit() {
    this.mobile = this.platform.width() <= 765;
    this.ventas = this.router.url.startsWith('/venta/');
    this.gruposeleccion = 'Todos los grupos';
    this.marcaseleccion = 'Todas las marcas';
    this.updateGrupos();
    this.updateProductosGrupo();
    this.carrito = this.compraService.venta;
    this.compraService.getCantidad().subscribe(cantidad => {
      this.cantidad = cantidad;
    });
  }

  public async agregar(producto: ProductoOptions) {
    if (!producto.cantidad || producto.cantidad <= 0) {
      this.fronService.presentAlert('Producto sin unidades', 'No es posible agregar este producto a la venta.', 'Este producto no tiene unidades en inventario.');
    } else {
      const productoCarrito = this.carrito && this.carrito.detalle.find(detalle => detalle.producto.id === producto.id);
      const cantidadProductoCarrito = productoCarrito && productoCarrito.cantidad;
      if (producto.cantidad <= cantidadProductoCarrito) {
        this.fronService.presentAlert('Producto sin unidades', 'No es posible agregar este producto a la venta.', 'La cantidad a agregar sobrepasa la cantidad en inventario.');
      } else {
        const combos = producto.combos;
        if (!combos || !combos[0]) {
          this.compraService.agregar(producto);
        } else if (combos && combos.length === 1) {
          producto.combos[0].activo = true;
          this.compraService.agregar(producto);
        } else if (combos) {
          producto.combos.forEach(combo => combo.activo = false);
          await this.presentCombos(producto);
        }
      }
    }
  }

  private async presentCombos(producto: ProductoOptions) {
    const combos = producto.combos;

    const buttons: any[] = combos.map(combo => {
      return {
        handler: () => {
          if (combo.cantidad && Number(combo.cantidad) > 0) {
            combo.activo = true;
            this.compraService.agregar(producto);
          } else {
            this.fronService.presentAlert('Error al ingresar producto', 'El producto seleccionado no tiene unidades disponible')
          }
        },
        text: `${combo.nombre} (Disp. ${combo.cantidad})`
      }
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Combos',
      subHeader: 'Selecciona uno de los combos',
      buttons
    });

    actionSheet.present();
  }

  private updateGrupos() {
    const grupoCollection = this.angularFirestore.collection<GrupoOptions>('grupos');
    grupoCollection.valueChanges().subscribe(grupos => {
      this.grupos = grupos;
    });
  }

  public updateProductosGrupo(event?: any) {
    const seleccionado = (event && event.detail.value) || '0';
    const productoCollection = this.angularFirestore.collection<ProductoOptions>('productos', ref => {
      this.agrupar = true;
      let query: any;
      if (this.ventas) {
        query = ref.where('activo', '==', true);
      }
      if (seleccionado != "0") {
        query = query ? query.where('grupo.id', "==", seleccionado) : ref.where('grupo.id', "==", seleccionado);
        this.agrupar = false;
      }
      return query || ref;
    });

    this.updateProductos(productoCollection);
  }

  private updateProductos(productoCollection: AngularFirestoreCollection<ProductoOptions>) {
    productoCollection.valueChanges().subscribe(productos => {
      this.productos = productos;
      this.productos.forEach(producto => {
        this.angularFirestore.doc(`productos/${producto.id}`).update({ cantidad: 0 });
      })
      this.gruposProducto = this.grupoService.agrupar(productos);
    });
  }

  public async ver(idproducto?: string) {
    const modal = await this.modalController.create({
      component: DetalleProductoComponent,
      componentProps: { idproducto: idproducto }
    });
    await modal.present();
  }

}
