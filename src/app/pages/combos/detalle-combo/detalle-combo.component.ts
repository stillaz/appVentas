import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { NavParams, Platform, ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase';
import { finalize } from 'rxjs/operators';
import { ComboOptions } from 'src/app/interfaces/combo-options';
import { GrupoOptions } from 'src/app/interfaces/grupo-options';
import { ProductoOptions } from 'src/app/interfaces/producto-options';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-detalle-combo',
  templateUrl: './detalle-combo.component.html',
  styleUrls: ['./detalle-combo.component.scss'],
})
export class DetalleComboComponent implements OnInit {

  public combo: ComboOptions;
  //private filePathImage: string;
  public grupos: GrupoOptions[];
  public id: string;
  public loading: any;
  public mobile: boolean;
  public productos: ProductoOptions[];
  public productosSeleccionados: ProductoOptions[];
  public todo: FormGroup;
  public compareWithFn = (o1: any, o2: any) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  constructor(
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private navParams: NavParams,
    private platform: Platform,
    private productoService: ProductoService,
    private storage: AngularFireStorage,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.updateGrupos();
    this.mobile = this.platform.is('cordova');
    this.id = this.navParams.get('idcombo');
    if (this.id) {
      this.updateCombo();
    } else {
      this.combo = {} as ComboOptions;
      this.form();
    }
  }

  public cantidad(event: any, index: number) {
    this.todo.value.productos[index].cantidad = event.detail.value;
  }

  private form() {
    this.todo = this.formBuilder.group({
      nombre: [this.combo.nombre, Validators.required, this.valorUnico()],
      imagen: [this.combo.imagen],
      grupo: [this.combo.grupo, Validators.required],
      productos: [this.combo.productos, Validators.required]
    });

    this.todo.get('grupo').valueChanges.subscribe(async (data: GrupoOptions) => {
      this.productos = await this.productoService.productosGrupo(data.id);
    });

    this.todo.get('productos').valueChanges.subscribe((productos: ProductoOptions[]) => {
      productos.forEach(producto => producto.cantidad = 1);
    });
  }

  private async updateCombo() {
    this.combo = (await this.productoService.combo(this.id)).data() as ComboOptions;
    this.productos = await this.productoService.productosGrupo(this.id);
    this.form();
  }

  private valorUnico(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (Validators.required(control)) return null;
      return new Promise(async resolve => {
        if (!this.id) {
          const id: string = control.value;

          const comboDocument = await this.productoService.combo(id);
          if (comboDocument.exists) {
            resolve({ valorUnico: true });
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    }
  }

  public sacarFoto() {
    /*const cameraOptions: CameraOptions = {
      quality: 50,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 1000,
      targetHeight: 1000,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true
    }

    this.camera.getPicture(cameraOptions).then((imageData) => {
      const imagen = "data:image/jpeg;base64," + imageData;
      const fileRef = this.storage.ref(this.filePathImage);
      fileRef.putString(imagen, firebase.storage.StringFormat.DATA_URL).then(() => {
        fileRef.getDownloadURL().subscribe(data => {
          this.todo.patchValue({ imagen: data });
        });
      });
    }).catch(err => alert('Upload Failed' + err));*/
  }

  public cargarImagen() {
    /*const cameraOptions: CameraOptions = {
      quality: 50,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(cameraOptions).then((imageData) => {
      const imagen = "data:image/jpeg;base64," + imageData;
      const fileRef = this.storage.ref(this.filePathImage);
      fileRef.putString(imagen, firebase.storage.StringFormat.DATA_URL).then(() => {
        fileRef.getDownloadURL().subscribe(data => {
          this.todo.patchValue({ imagen: data });
        });
      });
    }).catch(err => alert('Upload Failed' + err));
  }

  public seleccionarImagen(event: any) {
    const imagen = event.target.files[0];
    const fileRef = this.storage.ref(this.filePathImage);
    const task = this.storage.upload(this.filePathImage, imagen);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(data => {
          this.todo.patchValue({ imagen: data });
        });
      })
    ).subscribe();*/
  }

  public updateFilePath() {
    const id = this.todo.value.nombre;
    //this.filePathImage = id ? 'combos/' + id : null;
  }

  public cerrar() {
    this.modalController.dismiss();
  }

  public guardar() {
    const combo = this.todo.value;
    combo.id = combo.nombre;
    this.presentLoading();
    this.productoService.guardarCombo(combo).then(() => {
      this.presentToast('El combo ha sido registrado');
      this.loading.dismiss();
    }).catch(err => {
      this.presentAlertError(err, 'registrar');
      this.loading.dismiss();
    });
  }

  public eliminar() {
    this.presentAlertEliminar();
  }

  private async presentAlertEliminar() {
    const alert = await this.alertController.create({
      header: 'Eliminar combo',
      message: `¿Está seguro de eliminar el combo ${this.id}?`,
      buttons: [{
        text: 'Si',
        handler: () => {
          this.presentLoading();
          this.productoService.eliminarCombo(this.id).then(() => {
            this.presentToast('El combo ha sido eliminado');
            this.loading.dismiss();
          }).catch(err => {
            this.presentAlertError(err, 'eliminar');
            this.loading.dismiss();
          });
        }
      }, {
        text: 'No',
        role: 'cancel'
      }]
    });

    await alert.present();
  }

  private async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
    this.cerrar();
  }

  private async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Procesando...',
      spinner: 'crescent',
    });
    return await this.loading.present();
  }

  async presentAlertError(err: any, tipo: string) {
    const alert = await this.alertController.create({
      header: 'Ha ocurrido un error',
      subHeader: `Se presentó un error al ${tipo} el combo.`,
      message: `Error: ${err}`,
      buttons: ['OK']
    });

    alert.present();
  }

  private updateGrupos() {
    this.productoService.grupos().subscribe(grupos => {
      this.grupos = grupos;
    });
  }

}
