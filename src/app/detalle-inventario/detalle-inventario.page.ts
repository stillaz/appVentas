import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductoOptions } from '../producto-options';
import { ActivatedRoute } from '@angular/router';
import { InventarioOptions } from '../inventario-options';
import { GrupoService } from '../grupo.service';

@Component({
  selector: 'app-detalle-inventario',
  templateUrl: './detalle-inventario.page.html',
  styleUrls: ['./detalle-inventario.page.scss'],
})
export class DetalleInventarioPage implements OnInit {

  public inventario: any[];
  public producto: ProductoOptions;

  constructor(
    private activatedRoute: ActivatedRoute,
    private angularFirestore: AngularFirestore,
    private grupoService: GrupoService
  ) { }

  ngOnInit() {
    const idproducto = this.activatedRoute.snapshot.paramMap.get('producto');
    this.updateInventario(idproducto);
  }

  private updateInventario(id: string) {
    const productoDocument = this.angularFirestore.doc<ProductoOptions>(`productos/${id}`);
    productoDocument.valueChanges().subscribe(producto => {
      this.producto = producto;

      const inventarioCollection = productoDocument.collection<InventarioOptions>('inventario', ref => ref.orderBy('fecha', 'desc'));
      inventarioCollection.valueChanges().subscribe(inventario => {
        this.inventario = this.grupoService.agruparFecha(inventario);
      });
    });
  }

}
