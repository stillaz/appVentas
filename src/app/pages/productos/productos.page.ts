import { Component, OnInit } from '@angular/core';
import { VentaOptions } from 'src/app/interfaces/venta-options';
import { GrupoOptions } from 'src/app/interfaces/grupo-options';
import { ProductoOptions } from 'src/app/interfaces/producto-options';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { FrontService } from 'src/app/services/front.service';
import { GrupoService } from 'src/app/services/grupo.service';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { DetalleProductoComponent } from './detalle-producto/detalle-producto.component';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  agrupar: boolean;
  busqueda: string = '';
  cantidad: number;
  carrito: VentaOptions;
  filtro: string;
  grupos: GrupoOptions[];
  gruposProducto: any[];
  gruposeleccion: string;
  marcaseleccion: string;
  mensaje = true;
  modo = 'dos';
  productos: ProductoOptions[];
  ventas: boolean;

  pages: any[] = [
    { title: 'Productos más vendidos', component: '', icon: 'trending-up' },
    { title: 'Productos menos vendidos', component: '', icon: 'trending-down' },
    { title: 'Histórico inventario', component: '', icon: 'list-box' }
  ];

  constructor(
    private actionSheetController: ActionSheetController,
    private fronService: FrontService,
    private grupoService: GrupoService,
    private modalController: ModalController,
    private pedidoService: PedidoService,
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.ventas = this.router.url.startsWith('/ventas/');
    this.gruposeleccion = 'Todos los grupos';
    this.marcaseleccion = 'Todas las marcas';
    this.updateGrupos();
    this.updateProductosGrupo();
    this.carrito = this.pedidoService.venta;
    this.pedidoService.getCantidad().subscribe(cantidad => {
      this.cantidad = cantidad;
    });
  }

  async agregar(producto: ProductoOptions) {
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
          this.pedidoService.agregar(producto);
        } else if (combos && combos.length === 1) {
          producto.combos[0].activo = true;
          this.pedidoService.agregar(producto);
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
            this.pedidoService.agregar(producto);
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
    this.grupoService.grupos().subscribe(grupos => {
      this.grupos = grupos;
    });
  }

  updateProductosGrupo(event?: any) {
    const seleccionado = (event && event.detail.value) || '0';
    this.productoService.productos(true, seleccionado).subscribe(productos => {
      this.productos = productos;
      this.gruposProducto = this.grupoService.agrupar(productos);
    });
  }

  async ver(idproducto?: string) {
    const modal = await this.modalController.create({
      component: DetalleProductoComponent,
      componentProps: { idproducto: idproducto }
    });
    await modal.present();
  }

}
