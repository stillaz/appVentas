import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { NavParams, Platform, ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase';
import { finalize } from 'rxjs/operators';
import { GrupoOptions } from 'src/app/interfaces/grupo-options';
import { GrupoService } from 'src/app/services/grupo.service';

@Component({
  selector: 'app-detalle-grupo',
  templateUrl: './detalle-grupo.component.html',
  styleUrls: ['./detalle-grupo.component.scss'],
})
export class DetalleGrupoComponent implements OnInit {

  filePathImage: string;
  grupo: GrupoOptions;
  id: string;
  mobile: boolean;
  loading: any;
  todo: FormGroup;

  constructor(
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private grupoService: GrupoService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private navParams: NavParams,
    private platform: Platform,
    private storage: AngularFireStorage,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.mobile = this.platform.is('cordova');
    this.id = this.navParams.get('idgrupo');
    if (this.id) {
      this.updateGrupo();
    } else {
      this.grupo = {} as GrupoOptions;
      this.form();
    }
  }

  private async updateGrupo() {
    const grupo = (await this.grupoService.grupo(this.id)).data() as GrupoOptions;
    this.grupo = grupo;
    this.form();
  }

  private form() {
    this.todo = this.formBuilder.group({
      nombre: [{ value: this.grupo.nombre, disabled: this.id }, Validators.required, this.valorUnico()],
      imagen: [this.grupo.imagen]
    });
  }

  private valorUnico(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (Validators.required(control)) return null;
      return new Promise(async resolve => {
        if (!this.id) {
          const id: string = control.value;
          const grupoDoc = (await this.grupoService.grupo(id));

          if (grupoDoc.exists) {
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
    }).catch(err => alert('Upload Failed' + err));*/
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
    ).subscribe();
  }

  public updateFilePath() {
    const id = this.todo.value.nombre;
    this.filePathImage = id ? 'grupos/' + id : null;
  }

  public cerrar() {
    this.modalController.dismiss();
  }

  guardar() {
    this.presentLoading();
    const grupo = this.todo.value;
    grupo.id = grupo.nombre;
    this.grupoService.registrar(grupo).then(() => {
      this.presentToast('El grupo ha sido registrado');
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
      header: 'Eliminar grupo',
      message: `¿Está seguro de eliminar el grupo ${this.id}?`,
      buttons: [{
        text: 'Si',
        handler: () => {
          this.presentLoading();
          this.grupoService.eliminar(this.id).then(() => {
            this.presentToast('El grupo ha sido eliminado');
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
      subHeader: `Se presentó un error al ${tipo} el producto.`,
      message: `Error: ${err}`,
      buttons: ['OK']
    });

    alert.present();
  }

}
