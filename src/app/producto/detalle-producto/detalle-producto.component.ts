import { Component, OnInit } from '@angular/core';
import { ComboOptions } from 'src/app/combo-options';
import { GrupoOptions } from 'src/app/grupo-options';
import { ProductoOptions } from 'src/app/producto-options';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { NavParams, AlertController, ModalController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { isNumber } from 'util';
import firebase from 'firebase';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss'],
})
export class DetalleProductoComponent implements OnInit {

  public combos: ComboOptions[];
  public id: string;
  private filePathData: string;
  public loading: any;
  public mobile: boolean;
  public grupos: GrupoOptions[];
  public producto: ProductoOptions;
  private productoCollection: AngularFirestoreCollection;
  private productoDoc: AngularFirestoreDocument<ProductoOptions>;
  public todo: FormGroup;
  public compareWithFn = (o1: any, o2: any) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  constructor(
    private alertCtrl: AlertController,
    private storage: AngularFireStorage,
    private angularFirestore: AngularFirestore,
    private camera: Camera,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private platform: Platform,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.mobile = this.platform.is('cordova');
    this.id = this.navParams.get('idproducto');
    this.productoCollection = this.angularFirestore.collection('productos');
    this.updateGrupos();
    this.updateProducto();
  }

  private updateCombos(grupo: string) {
    const comboCollection = this.angularFirestore
      .collection<ComboOptions>('combos', ref => ref.where('grupo.id', '==', grupo));
    comboCollection.valueChanges().subscribe(combos => {
      this.combos = combos;
    });
  }

  private updateGrupos() {
    const grupoCollection = this.angularFirestore.collection<GrupoOptions>('grupos', ref => ref.orderBy('nombre'));
    grupoCollection.valueChanges().subscribe(grupos => {
      this.grupos = grupos;
    });
  }

  private updateProducto() {
    if (this.id) {
      this.productoDoc = this.productoCollection.doc(this.id);
      this.productoDoc.valueChanges().subscribe(producto => {
        this.producto = producto;
        this.form();
      });
    } else {
      this.producto = {} as ProductoOptions;
      this.form();
    }
  }

  private form() {
    this.todo = this.formBuilder.group({
      id: [{ value: this.producto.id, disabled: this.id }, Validators.required, this.valorUnico()],
      combos: [this.producto.combos],
      nombre: [this.producto.nombre, Validators.required],
      descripcion: [this.producto.descripcion, Validators.required],
      grupo: [this.producto.grupo, Validators.required],
      precio: [this.producto.precio, Validators.required],
      imagen: [this.producto.imagen],
      maneja_inventario: [this.producto.maneja_inventario],
      activo: [this.producto ? this.producto.activo : true]
    });
    const grupo = this.todo.value.grupo;
    if (grupo) {
      this.updateCombos(grupo.id);
    }

    this.todo.get('grupo').valueChanges.subscribe((data: GrupoOptions) => {
      this.updateCombos(data.id);
    });
  }

  private valorUnico(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (Validators.required(control)) return null;
      return new Promise(resolve => {
        if (!this.id) {
          const id: string = control.value;
          const productoDoc = this.productoCollection.doc(id);

          productoDoc.get().subscribe(data => {
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

  public guardar() {
    const precioForm = this.todo.value.precio;
    const precio = !isNumber(precioForm) ? parseInt(precioForm.replace(/[^\d]/g, "")) : precioForm;
    const producto: ProductoOptions = this.todo.value;
    producto.precio = precio;
    this.presentLoading();
    if (this.id) {
      this.productoDoc.update({
        combos: producto.combos,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        imagen: producto.imagen,
        grupo: producto.grupo,
        precio: producto.precio,
        activo: producto.activo,
        maneja_inventario: producto.maneja_inventario
      }).then(() => {
        this.presentToast('El producto ha sido actualizado');
        this.loading.dismiss();
      }).catch(err => {
        this.presentAlertError(err, 'actualizar');
        this.loading.dismiss();
      });
    } else {
      producto.cantidad = 0;
      this.productoDoc.set(producto).then(() => {
        this.presentToast('El producto ha sido registrado');
        this.loading.dismiss();
      }).catch(err => {
        this.presentAlertError(err, 'registrar');
        this.loading.dismiss();
      });
    }
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
    this.salir();
  }

  public salir() {
    this.modalCtrl.dismiss();
  }

  async presentAlertError(err: any, tipo: string) {
    const alert = await this.alertCtrl.create({
      header: 'Ha ocurrido un error',
      subHeader: `Se presentó un error al ${tipo} el producto.`,
      message: `Error: ${err}`,
      buttons: ['OK']
    });

    alert.present();
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
    };

    this.camera.getPicture(cameraOptions).then((imageData) => {
      const imagen = "data:image/jpeg;base64," + imageData;
      const fileRef = this.storage.ref(this.filePathData);
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
      const fileRef = this.storage.ref(this.filePathData);
      fileRef.putString(imagen, firebase.storage.StringFormat.DATA_URL).then(() => {
        fileRef.getDownloadURL().subscribe(data => {
          this.todo.patchValue({ imagen: data });
        });
      });
    }).catch(err => alert('Upload Failed' + err));
  }

  public seleccionarImagen(event: any) {
    const imagen = event.target.files[0];
    const fileRef = this.storage.ref(this.filePathData);
    const task = this.storage.upload(this.filePathData, imagen);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(data => {
          this.todo.patchValue({ imagen: data });
        });
      })
    ).subscribe();
  }

  public updateFilePath() {
    const id = this.todo.value.id;
    this.filePathData = id ? 'productos/' + id : null;
    this.productoDoc = this.angularFirestore.doc(this.filePathData);
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Procesando...',
      spinner: 'crescent',
    });
    return await this.loading.present();
  }

  public eliminar() {
    this.presentAlertEliminar();
  }

  private async presentAlertEliminar() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar grupo',
      message: `¿Está seguro de eliminar el grupo ${this.id}?`,
      buttons: [{
        text: 'Si',
        handler: () => {
          const productoDoc = this.productoCollection.doc(this.id);
          this.presentLoading();
          productoDoc.delete().then(() => {
            this.presentToast('El producto ha sido eliminado');
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

}
