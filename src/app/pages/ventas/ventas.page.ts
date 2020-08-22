import { Component, OnInit } from '@angular/core';
import { EstadoVenta } from 'src/app/enums/estado-venta.enum';
import { VentaService } from 'src/app/services/venta.service';
import { VentaOptions } from 'src/app/interfaces/venta-options';
import { ModalController } from '@ionic/angular';
import { DetalleVentaComponent } from './detalle-venta/detalle-venta.component';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements OnInit {

  estado = EstadoVenta.PENDIENTE;
  pedidos = {} as any;
  subscribe: Subscription;

  constructor(private modalController: ModalController, private ventaService: VentaService) { }

  ngOnInit() {
    this.updatePedidos();
  }

  private updatePedidos() {
    this.subscribe = this.ventaService.ventas(this.estado).subscribe(ventas => {
      const cantidad = ventas.map(venta => venta.pendiente).reduce((a, b) => a + b);
      this.pedidos = { cantidad, items: [] };
      ventas.forEach(async (venta, index) => {
        const ventasDia = await this.ventaService.ventasDia(venta.id, this.estado);
        this.pedidos.items.push.apply(this.pedidos.items, ventasDia);
        if (index === ventas.length - 1) {
          this.pedidos.items.sort((a: VentaOptions, b: VentaOptions) => a.actualizacion < b.actualizacion ? -1 : 1);
        }
      });
    });
  }

  async ver(pedido: VentaOptions) {
    const iddia = moment(pedido.fecha.toDate()).startOf('day').toDate().getTime();
    const modal = await this.modalController.create({
      component: DetalleVentaComponent,
      componentProps: {
        idventa: pedido.id,
        fecha: iddia
      }
    });

    modal.onDidDismiss().then(() => {
      this.subscribe.unsubscribe();
      this.updatePedidos();
    });

    modal.present();
  }
}
