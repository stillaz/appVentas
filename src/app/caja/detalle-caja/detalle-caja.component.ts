import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { isNumber } from 'util';
import { AngularFirestore } from '@angular/fire/firestore';
import { CajaOptions } from 'src/app/caja-options';
import { EstadoCaja } from 'src/app/estado-caja.enum';
import { UsuarioService } from 'src/app/usuario.service';
import { FrontService } from 'src/app/front.service';
import { EstadoMovimiento } from 'src/app/estado-movimiento.enum';
import { ModalController } from '@ionic/angular';
import { CajaService } from 'src/app/caja.service';

@Component({
  selector: 'app-detalle-caja',
  templateUrl: './detalle-caja.component.html',
  styleUrls: ['./detalle-caja.component.scss'],
})
export class DetalleCajaComponent implements OnInit {

  public caja: CajaOptions;
  public entrada: FormControl;
  public movimiento: CajaOptions;
  public movimientos: CajaOptions[];
  public opcion: string;

  constructor(
    private angularFirestore: AngularFirestore,
    private cajaService: CajaService,
    private frontService: FrontService,
    private modalController: ModalController,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.entrada = new FormControl('', Validators.compose([Validators.required, Validators.min(0)]));
    this.caja = this.cajaService.caja;
    this.movimiento = this.cajaService.movimiento;
    this.updateMovimientos();
  }

  public async guardar() {
    const loading = await this.frontService.presentLoading('Procesando...');
    const entradaValue = this.entrada.value;
    const entrada = !isNumber(entradaValue) ? parseInt(entradaValue.replace(/[^\d]/g, "")) : entradaValue;
    const fecha = new Date();
    const cajaDocument = this.angularFirestore.doc<CajaOptions>(`cajas/${this.caja}`);
    const batch = this.angularFirestore.firestore.batch();
    const caja = this.cajaService.caja;
    caja.actualizacion = fecha;
    caja.estado = EstadoCaja.ABIERTA;
    caja.fecha = fecha;
    caja.ingreso = entrada;
    caja.usuario = this.usuarioService.getUsuario();
    if (!caja.movimientos) {
      caja.movimientos = 0;
      caja.total = 0;
    }

    caja.movimientos = Number(caja.movimientos) + 1;
    caja.total = Number(caja.total) + entrada;
    batch.update(cajaDocument.ref, caja);

    const movimiento = caja;
    const idmovimiento = fecha.getTime().toString();
    movimiento.id = idmovimiento;
    const movimientoCajaDocument = cajaDocument.collection('movimientos').doc(idmovimiento);
    batch.set(movimientoCajaDocument.ref, caja);

    const movimientoDocument = movimientoCajaDocument.collection('movimientos').doc(idmovimiento);
    movimiento.estado = EstadoMovimiento.APERTURA_CAJA;
    batch.set(movimientoDocument.ref, movimiento);

    batch.commit().then(() => {
      loading.dismiss();
      this.modalController.dismiss();
      this.frontService.presentToast('Se ha realizado la apertura de la caja');
    }).catch(err => {
      loading.dismiss();
      this.frontService.presentAlert('Ha ocurrido un error', `Error: ${err}`, 'Se presentó al abrir caja.')
    });
  }

  private updateMovimientos() {
    const movimientoCollection = this.angularFirestore.collection<CajaOptions>(`cajas/${this.caja.id}/movimientos/${this.movimiento.id}/movimientos`, ref => ref.orderBy('fecha', 'asc'));
    movimientoCollection.valueChanges().subscribe(movimientos => {
      this.movimientos = movimientos;
    });
  }

}
