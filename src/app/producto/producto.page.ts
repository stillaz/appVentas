import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProductoOptions } from '../producto-options';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { DetalleProductoPage } from '../detalle-producto/detalle-producto.page';
import { GrupoOptions } from '../grupo-options';
import { Router } from '@angular/router';
import { CompraService } from '../compra.service';
import { VentaOptions } from '../venta-options';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {

  public agrupar: boolean;
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
    private angularFirestore: AngularFirestore,
    public compraService: CompraService,
    private modalCtrl: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.gruposeleccion = 'Todos los grupos';
    this.marcaseleccion = 'Todas las marcas';
    this.updateGrupos();
    this.ventas = this.router.url.startsWith('/tabs/venta/');
    this.carrito = this.compraService.venta;
    this.compraService.getCantidad().subscribe(cantidad => {
      this.cantidad = cantidad;
    });
  }

  public agregar(producto: ProductoOptions) {
    this.compraService.agregar(producto);
  }

  private updateGrupos() {
    const grupoCollection = this.angularFirestore.collection<GrupoOptions>('grupos');
    grupoCollection.valueChanges().subscribe(grupos => {
      this.grupos = grupos;
    });
  }

  public updateProductosGrupo(event: any) {
    const seleccionado = event.detail.value;
    let productoCollection: AngularFirestoreCollection<ProductoOptions>;
    if (seleccionado == "0") {
      productoCollection = this.angularFirestore.collection('productos');
      this.agrupar = true;
    } else {
      productoCollection = this.angularFirestore.collection('productos', ref => ref.where('grupo.id', "==", seleccionado));
      this.agrupar = false;
    }

    this.updateProductos(productoCollection);
  }

  private updateProductos(productoCollection: AngularFirestoreCollection<ProductoOptions>) {
    productoCollection.valueChanges().subscribe(productos => {
      this.productos = productos;
      this.updateGruposProductos();
    });
  }

  private updateGruposProductos() {
    const grupos = [];
    this.gruposProducto = [];
    this.productos.forEach(producto => {
      const grupo = producto.grupo;
      if (grupos[grupo.id] === undefined) {
        grupos[grupo.id] = [];
      }
      grupos[grupo.id].push(producto);
    });

    for (let grupo in grupos) {
      const dataGrupo = this.grupos.find(todos => todos.id === grupo);
      this.gruposProducto.push({ grupo: dataGrupo, productos: grupos[grupo] });
    }
  }

  public async ver(idproducto: string) {
    const modal = await this.modalCtrl.create({
      component: DetalleProductoPage,
      componentProps: { idproducto: idproducto }
    });
    await modal.present();
  }

}
