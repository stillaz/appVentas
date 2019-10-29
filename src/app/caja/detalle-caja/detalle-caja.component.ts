import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { isNumber } from 'util';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { CajaOptions } from 'src/app/caja-options';
import { EstadoCaja } from 'src/app/estado-caja.enum';
import { UsuarioService } from 'src/app/usuario.service';
import { FrontService } from 'src/app/front.service';
import { EstadoMovimiento } from 'src/app/estado-movimiento.enum';
import { ModalController, AlertController } from '@ionic/angular';
import { CajaService } from 'src/app/caja.service';
import { GrupoService } from 'src/app/grupo.service';
import cloneDeep from 'lodash/cloneDeep';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-detalle-caja',
  templateUrl: './detalle-caja.component.html',
  styleUrls: ['./detalle-caja.component.scss'],
})
export class DetalleCajaComponent implements OnInit {

  public caja: CajaOptions;
  public entrada: FormControl;
  public movimiento: CajaOptions;
  public movimientos: any[];
  public opcion: string;

  constructor(
    private alertController: AlertController,
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private cajaService: CajaService,
    private frontService: FrontService,
    private grupoService: GrupoService,
    private modalController: ModalController,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.caja = this.cajaService.caja;
    this.entrada = new FormControl(null, Validators.compose([Validators.required, Validators.min(0), this.maximo()]));
    this.movimiento = this.cajaService.movimiento;
    this.updateMovimientos();
  }

  private actualizarCaja(caja: CajaOptions, fecha: Date, entrada: number, batch: firebase.firestore.WriteBatch, descuadre?: boolean) {
    caja.actualizacion = fecha;
    caja.usuario = this.usuarioService.getUsuario();
    switch (this.opcion) {
      case 'Cierre':
        caja.estado = descuadre ? EstadoCaja.DESCUADRE : EstadoCaja.CERRADA;
        caja.movimientos = Number(caja.movimientos) + 1;
        caja.descuadre = entrada - Number(caja.total);
        caja.valorDescuadre = caja.total;
        caja.total = entrada;
        break;

      case 'Retiro':
        caja.ingreso = -entrada;
        caja.movimientos = Number(caja.movimientos) + 1;
        caja.total = Number(caja.total) - entrada
        break;

      case 'Inicio':
      case 'Apertura':
        caja.estado = EstadoCaja.ABIERTA;
        caja.fecha = fecha;
        caja.ingreso = entrada;
        caja.movimientos = 1;
        caja.total = entrada;
        break;
    }
    const cajaDocument = this.angularFirestore.doc<CajaOptions>(`cajas/${caja.id}`);
    batch.update(cajaDocument.ref, caja);
  }

  public cerrar() {
    this.modalController.dismiss();
  }

  public async guardar() {
    const entradaValue = this.entrada.value;
    const entrada = !isNumber(entradaValue) ? parseInt(entradaValue.replace(/[^\d]/g, "")) : entradaValue;
    if (this.opcion === 'Cierre' && Number(this.caja.total) !== entrada) {
      const alert = await this.alertController.create({
        header: 'Descuadre de caja',
        subHeader: 'El valor total en caja no coincide con el valor ingresado en el cierre.',
        message: '¿Desea continuar con los valores descuadrados en caja?',
        buttons: [{
          text: 'Si',
          handler: () => {
            this.procesarCaja(entrada, true);
          }
        }, 'No']
      });

      alert.present();
    } else if (this.opcion === 'Retiro') {
      const alert = await this.alertController.create({
        header: 'Retiro de caja',
        message: `¿Está seguro retirar ${entrada} de la caja?`,
        buttons: [{
          text: 'Si',
          handler: () => {
            this.procesarCaja(entrada, true);
          }
        }, 'No']
      });

      alert.present();
    } else {
      this.procesarCaja(entrada);
    }
  }

  private maximo(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (Validators.required(control)) return null;
      const entrada = control.value;
      const valor = !isNumber(entrada) ? parseInt(entrada.replace(/[^\d]/g, "")) : entrada;
      const max = this.opcion === 'Retiro' && Number(this.caja.total);
      if (max && max < valor) {
        return { max: true };
      }
      return null;
    }
  }

  private async procesarCaja(entrada: number, descuadre?: boolean) {
    const loading = await this.frontService.presentLoading('Procesando...');
    const fecha = new Date();

    const batch = this.angularFirestore.firestore.batch();
    const caja = this.cajaService.caja;

    this.actualizarCaja(caja, fecha, entrada, batch, descuadre);
    this.registroMovimiento(caja, fecha, entrada, batch, descuadre);

    batch.commit().then(() => {
      loading.dismiss();
      this.modalController.dismiss();
      if (this.opcion === 'Cierre') {
        this.angularFireAuth.auth.signOut();
      } else {
        this.frontService.presentToast('Se ha realizado la apertura de la caja');
      }
    }).catch(err => {
      loading.dismiss();
      this.frontService.presentAlert('Ha ocurrido un error', `Error: ${err}`, 'Se presentó al abrir caja.')
    });
  }

  private registroMovimiento(caja: CajaOptions, fecha: Date, entrada: number, batch: firebase.firestore.WriteBatch, descuadre?: boolean) {
    const movimiento = this.opcion === 'Inicio' ? cloneDeep(caja) : this.movimiento;
    const idmovimiento = fecha.getTime().toString();
    movimiento.actualizacion = fecha;
    movimiento.usuario = this.usuarioService.getUsuario();
    let movimientoCajaDocument: AngularFirestoreDocument;
    switch (this.opcion) {
      case 'Apertura':
        movimiento.estado = EstadoMovimiento.APERTURA_CAJA;
        movimiento.id = idmovimiento;
        movimiento.fecha = fecha;
        movimiento.ingreso = entrada;
        movimiento.movimientos = 1;
        movimiento.total = entrada;
        movimientoCajaDocument = this.angularFirestore.doc(`cajas/${caja.id}/movimientos/${idmovimiento}`);
        batch.set(movimientoCajaDocument.ref, movimiento);
        break;
      case 'Cierre':
        movimiento.estado = descuadre ? EstadoMovimiento.DESCUADRE_CAJA : EstadoMovimiento.CIERRE_CAJA;
        movimiento.movimientos = Number(movimiento.movimientos) + 1;
        movimiento.total = entrada;
        movimientoCajaDocument = this.angularFirestore.doc(`cajas/${caja.id}/movimientos/${movimiento.id}`);
        batch.update(movimientoCajaDocument.ref, movimiento);
        break;
      case 'Inicio':
        movimiento.estado = EstadoMovimiento.INICIO_CAJA;
        movimiento.id = idmovimiento;
        movimiento.fecha = fecha;
        movimiento.ingreso = entrada;
        movimiento.movimientos = 1;
        movimiento.total = entrada;
        movimientoCajaDocument = this.angularFirestore.doc(`cajas/${caja.id}/movimientos/${idmovimiento}`);
        batch.set(movimientoCajaDocument.ref, movimiento);
        break;
      case 'Retiro':
        movimiento.estado = EstadoMovimiento.RETIRO;
        movimiento.movimientos = Number(movimiento.movimientos) + 1;
        movimiento.total = Number(movimiento.total) - entrada;
        movimientoCajaDocument = this.angularFirestore.doc(`cajas/${caja.id}/movimientos/${movimiento.id}`);
        batch.update(movimientoCajaDocument.ref, movimiento);
        break;
    }

    const movimientoDocument = movimientoCajaDocument.collection('movimientos').doc(idmovimiento);
    batch.set(movimientoDocument.ref, movimiento);
  }

  private updateMovimientos() {
    if (this.movimiento) {
      const movimientoCollection = this.angularFirestore
        .collection<CajaOptions>(`cajas/${this.caja.id}/movimientos/${this.movimiento.id}/movimientos`, ref => ref.orderBy('fecha', 'asc'));
      movimientoCollection.valueChanges().subscribe(movimientos => {
        this.movimientos = this.grupoService.agruparCampo(movimientos, 'estado');
      });
    }
  }

}
