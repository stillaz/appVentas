import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ComboOptions } from 'src/app/combo-options';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { NavParams, Platform, ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase';
import { finalize } from 'rxjs/operators';
import { GrupoOptions } from 'src/app/grupo-options';
import { ProductoOptions } from 'src/app/producto-options';

@Component({
  selector: 'app-detalle-combo',
  templateUrl: './detalle-combo.component.html',
  styleUrls: ['./detalle-combo.component.scss'],
})
export class DetalleComboComponent implements OnInit {

  public combo: ComboOptions;
  private filePathImage: string;
  public grupos: GrupoOptions[];
  private comboCollection: AngularFirestoreCollection<ComboOptions>;
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
    private angularFirestore: AngularFirestore,
    private camera: Camera,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private navParams: NavParams,
    private platform: Platform,
    private storage: AngularFireStorage,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.updateGrupos();
    this.mobile = this.platform.is('cordova');
    this.id = this.navParams.get('idcombo');
    this.comboCollection = this.angularFirestore.collection('combos');
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

    this.todo.get('grupo').valueChanges.subscribe((data: GrupoOptions) => {
      this.updateProductos(data.id);
    });

    this.todo.get('productos').valueChanges.subscribe((productos: ProductoOptions[]) => {
      productos.forEach(producto => producto.cantidad = 1);
    });
  }

  private updateCombo() {
    const comboDocument = this.comboCollection.doc<ComboOptions>(this.id);
    comboDocument.valueChanges().subscribe(combo => {
      this.combo = combo;
      this.updateProductos(this.combo.grupo.id);
      this.form();
    });
  }

  private valorUnico(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (Validators.required(control)) return null;
      return new Promise(resolve => {
        if (!this.id) {
          const id: string = control.value;
          const comboDocument = this.comboCollection.doc(id);

          comboDocument.get().subscribe(data => {
            if (data.exists) {
              resolve({ valorUnico: true });
            } else {
              resolve(null);
            }
          });
        } else {
          resolve(null);
        }
      });
    }
  }

  public sacarFoto() {
    const cameraOptions: CameraOptions = {
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
    }).catch(err => alert('Upload Failed' + err));
  }

  public cargarImagen() {
    const cameraOptions: CameraOptions = {
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
    ).subscribe();
  }

  public updateFilePath() {
    const id = this.todo.value.nombre;
    this.filePathImage = id ? 'combos/' + id : null;
  }

  public cerrar() {
    this.modalController.dismiss();
  }

  public guardar() {
    const combo = this.todo.value;
    combo.id = combo.nombre;
    const comboDocument = this.comboCollection.doc(combo.id);
    this.presentLoading();
    comboDocument.set(combo).then(() => {
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
          const comboDocument = this.comboCollection.doc(this.id);
          this.presentLoading();
          comboDocument.delete().then(() => {
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
    const grupoCollection = this.angularFirestore.collection<GrupoOptions>('grupos', ref => ref.orderBy('nombre'));
    grupoCollection.valueChanges().subscribe(grupos => {
      this.grupos = grupos;
    });
  }

  private updateProductos(grupo: string) {
    const productoCollection = this.angularFirestore.collection<ProductoOptions>('productos', ref => ref.where('grupo.id', '==', grupo));
    productoCollection.valueChanges().subscribe(productos => {
      this.productos = productos;
    });
  }

}
