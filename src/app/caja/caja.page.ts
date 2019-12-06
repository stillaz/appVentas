import { Component, OnInit } from '@angular/core';
import { CajaService } from '../caja.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { CajaOptions } from '../caja-options';
import { PopoverController, AlertController, NavController } from '@ionic/angular';
import { MenuCajaComponent } from './menu-caja/menu-caja.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoCaja } from '../estado-caja.enum';
import { FrontService } from '../front.service';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.page.html',
  styleUrls: ['./caja.page.scss'],
})
export class CajaPage implements OnInit {

  public administracion: boolean;
  public caja: CajaOptions;
  public cajas: CajaOptions[];
  public movimiento: CajaOptions;
  public movimientos: CajaOptions[];

  constructor(
    private alertController: AlertController,
    private angularFirestore: AngularFirestore,
    private cajaService: CajaService,
    private frontService: FrontService,
    private navController: NavController,
    private popoverController: PopoverController,
    private router: Router
  ) { }

  ngOnInit() {
    this.administracion = this.router.url.startsWith('/configuracion');
    if (!this.administracion) {
      this.caja = this.cajaService.caja;
      this.movimiento = this.cajaService.movimiento;
      this.updateMovimientos();
    } else {
      this.updateCajas();
    }
  }

  public async menu(ev: any) {
    const popover = await this.popoverController.create({
      component: MenuCajaComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  private registrarCaja(id: string) {
    const fecha = new Date();
    const cajaDocument = this.angularFirestore.doc(`cajas/${id}`);
    cajaDocument.get().subscribe(async caja => {
      if (!caja.exists) {
        const cajaData: CajaOptions = {
          actualizacion: fecha,
          estado: EstadoCaja.CERRADA,
          fecha: fecha,
          id: id,
          ingreso: null,
          movimientos: 0,
          total: 0,
          usuario: null
        };
        await cajaDocument.set(cajaData);
        await this.frontService.presentToast(`La caja ${id} ha sido registrada`);
        this.cajaService.updateCaja(id);
        this.navController.navigateBack('home');
      }
    });
  }

  private updateCajas() {
    const cajaCollection = this.angularFirestore.collection<CajaOptions>('cajas');
    cajaCollection.valueChanges().subscribe(cajas => {
      this.cajas = cajas;
    });
  }

  private updateMovimientos() {
    if (this.movimiento) {
      const movimientoCollection = this.angularFirestore.collection<CajaOptions>(`cajas/${this.caja.id}/movimientos/${this.movimiento.id}/movimientos`, ref => ref.orderBy('fecha', 'asc'));
      movimientoCollection.valueChanges().subscribe(movimientos => {
        this.movimientos = movimientos;
      });
    }
  }

  public async ver(caja?: string) {
    if (!caja) {
      const alert = await this.alertController.create({
        header: 'Registro de caja',
        message: 'Ingresa el id de la caja',
        inputs: [{
          name: 'caja',
          type: 'text'
        }],
        buttons: [{
          text: 'Aceptar',
          handler: data => {
            if (data && data.caja) {
              this.registrarCaja(data.caja);
            }
          }
        }, 'Cancelar']
      });

      alert.present();
    } else {
      this.cajaService.updateCaja(caja);
      this.navController.navigateForward('caja');
    }
  }

}
