import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavParams, ToastController, AlertController, ModalController, LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Camera } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { finalize } from 'rxjs/operators';
import { isNumber } from 'util';
var DetalleProductoPage = /** @class */ (function () {
    function DetalleProductoPage(navParams, af, formBuilder, toastCtrl, modalCtrl, alertCtrl, camera, storage, loadingCtrl) {
        this.navParams = navParams;
        this.af = af;
        this.formBuilder = formBuilder;
        this.toastCtrl = toastCtrl;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.camera = camera;
        this.storage = storage;
        this.loadingCtrl = loadingCtrl;
        this.compareWithFn = function (o1, o2) {
            return o1 && o2 ? o1.id === o2.id : o1 === o2;
        };
    }
    DetalleProductoPage.prototype.ngOnInit = function () {
        this.id = this.navParams.get('idproducto');
        this.productoCollection = this.af.collection('productos');
        this.updateGrupos();
        this.updateProducto();
    };
    DetalleProductoPage.prototype.updateGrupos = function () {
        var _this = this;
        var grupoCollection = this.af.collection('grupos', function (ref) { return ref.orderBy('nombre'); });
        grupoCollection.valueChanges().subscribe(function (grupos) {
            _this.grupos = grupos;
        });
    };
    DetalleProductoPage.prototype.updateProducto = function () {
        var _this = this;
        if (this.id) {
            this.productoDoc = this.productoCollection.doc(this.id);
            this.productoDoc.valueChanges().subscribe(function (producto) {
                _this.producto = producto;
                _this.form();
            });
        }
        else {
            this.producto = {};
            this.form();
        }
    };
    DetalleProductoPage.prototype.form = function () {
        this.todo = this.formBuilder.group({
            id: [{ value: this.producto.id, disabled: this.id }, Validators.required, this.valorUnico()],
            nombre: [this.producto.nombre, Validators.required],
            descripcion: [this.producto.descripcion, Validators.required],
            grupo: [this.producto.grupo, Validators.required],
            precio: [this.producto.precio, Validators.required],
            imagen: [this.producto.imagen],
            activo: [this.producto.activo || true]
        });
    };
    DetalleProductoPage.prototype.valorUnico = function () {
        var _this = this;
        return function (control) {
            if (Validators.required(control))
                return null;
            return new Promise(function (resolve) {
                if (!_this.id) {
                    var id = control.value;
                    var productoDoc = _this.productoCollection.doc(id);
                    productoDoc.get().subscribe(function (data) {
                        if (data.exists) {
                            resolve({ valorUnico: true });
                        }
                        else {
                            resolve(null);
                        }
                    });
                }
                else {
                    resolve(null);
                }
            });
        };
    };
    DetalleProductoPage.prototype.guardar = function () {
        var _this = this;
        var precioForm = this.todo.value.precio;
        var precio = !isNumber(precioForm) ? parseInt(precioForm.replace(/[^\d]/g, "")) : precioForm;
        var producto = this.todo.value;
        producto.precio = precio;
        this.presentLoading();
        if (this.id) {
            this.productoDoc.update({
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                imagen: producto.imagen,
                grupo: producto.grupo,
                precio: producto.precio,
                activo: producto.activo
            }).then(function () {
                _this.presentToast('El producto ha sido actualizado');
                _this.loading.dismiss();
            }).catch(function (err) {
                _this.presentAlertError(err, 'actualizar');
                _this.loading.dismiss();
            });
        }
        else {
            this.productoDoc.set(producto).then(function () {
                _this.presentToast('El producto ha sido registrado');
                _this.loading.dismiss();
            }).catch(function (err) {
                _this.presentAlertError(err, 'registrar');
                _this.loading.dismiss();
            });
        }
    };
    DetalleProductoPage.prototype.presentToast = function (mensaje) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastCtrl.create({
                            message: mensaje,
                            duration: 3000
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        this.salir();
                        return [2 /*return*/];
                }
            });
        });
    };
    DetalleProductoPage.prototype.salir = function () {
        this.modalCtrl.dismiss();
    };
    DetalleProductoPage.prototype.presentAlertError = function (err, tipo) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
                            header: 'Ha ocurrido un error',
                            subHeader: "Se present\u00F3 un error al " + tipo + " el producto.",
                            message: "Error: " + err,
                            buttons: ['OK']
                        })];
                    case 1:
                        alert = _a.sent();
                        alert.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    DetalleProductoPage.prototype.sacarFoto = function () {
        var _this = this;
        var cameraOptions = {
            quality: 50,
            encodingType: this.camera.EncodingType.JPEG,
            targetWidth: 1000,
            targetHeight: 1000,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.CAMERA,
            correctOrientation: true
        };
        this.camera.getPicture(cameraOptions).then(function (imageData) {
            var imagen = "data:image/jpeg;base64," + imageData;
            var fileRef = _this.storage.ref(_this.filePathData);
            fileRef.putString(imagen, firebase.storage.StringFormat.DATA_URL).then(function () {
                fileRef.getDownloadURL().subscribe(function (data) {
                    _this.todo.patchValue({ imagen: data });
                });
            });
        }).catch(function (err) { return alert('Upload Failed' + err); });
    };
    DetalleProductoPage.prototype.cargarImagen = function () {
        var _this = this;
        var cameraOptions = {
            quality: 50,
            encodingType: this.camera.EncodingType.JPEG,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true
        };
        this.camera.getPicture(cameraOptions).then(function (imageData) {
            var imagen = "data:image/jpeg;base64," + imageData;
            var fileRef = _this.storage.ref(_this.filePathData);
            fileRef.putString(imagen, firebase.storage.StringFormat.DATA_URL).then(function () {
                fileRef.getDownloadURL().subscribe(function (data) {
                    _this.todo.patchValue({ imagen: data });
                });
            });
        }).catch(function (err) { return alert('Upload Failed' + err); });
    };
    DetalleProductoPage.prototype.seleccionarImagen = function (event) {
        var _this = this;
        var imagen = event.target.files[0];
        var fileRef = this.storage.ref(this.filePathData);
        var task = this.storage.upload(this.filePathData, imagen);
        task.snapshotChanges().pipe(finalize(function () {
            fileRef.getDownloadURL().subscribe(function (data) {
                _this.todo.patchValue({ imagen: data });
            });
        })).subscribe();
    };
    DetalleProductoPage.prototype.updateFilePath = function () {
        var id = this.todo.value.id;
        this.filePathData = id ? 'productos/' + id : null;
        this.productoDoc = this.af.doc(this.filePathData);
    };
    DetalleProductoPage.prototype.presentLoading = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.loadingCtrl.create({
                                message: 'Procesando...',
                                spinner: 'crescent',
                            })];
                    case 1:
                        _a.loading = _b.sent();
                        return [4 /*yield*/, this.loading.present()];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    DetalleProductoPage.prototype.eliminar = function () {
        this.presentAlertEliminar();
    };
    DetalleProductoPage.prototype.presentAlertEliminar = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
                            header: 'Eliminar grupo',
                            message: "\u00BFEst\u00E1 seguro de eliminar el grupo " + this.id + "?",
                            buttons: [{
                                    text: 'Si',
                                    handler: function () {
                                        var productoDoc = _this.productoCollection.doc(_this.id);
                                        _this.presentLoading();
                                        productoDoc.delete().then(function () {
                                            _this.presentToast('El producto ha sido eliminado');
                                            _this.loading.dismiss();
                                        }).catch(function (err) {
                                            _this.presentAlertError(err, 'eliminar');
                                            _this.loading.dismiss();
                                        });
                                    }
                                }, {
                                    text: 'No',
                                    role: 'cancel'
                                }]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DetalleProductoPage = tslib_1.__decorate([
        Component({
            selector: 'app-detalle-producto',
            templateUrl: './detalle-producto.page.html',
            styleUrls: ['./detalle-producto.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [NavParams,
            AngularFirestore,
            FormBuilder,
            ToastController,
            ModalController,
            AlertController,
            Camera,
            AngularFireStorage,
            LoadingController])
    ], DetalleProductoPage);
    return DetalleProductoPage;
}());
export { DetalleProductoPage };
//# sourceMappingURL=detalle-producto.page.js.map