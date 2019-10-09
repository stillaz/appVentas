import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavParams, Platform, ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase';
import { finalize } from 'rxjs/operators';
var DetalleComboComponent = /** @class */ (function () {
    function DetalleComboComponent(alertController, angularFirestore, camera, formBuilder, loadingController, modalController, navParams, platform, storage, toastController) {
        this.alertController = alertController;
        this.angularFirestore = angularFirestore;
        this.camera = camera;
        this.formBuilder = formBuilder;
        this.loadingController = loadingController;
        this.modalController = modalController;
        this.navParams = navParams;
        this.platform = platform;
        this.storage = storage;
        this.toastController = toastController;
        this.compareWithFn = function (o1, o2) {
            return o1 && o2 ? o1.id === o2.id : o1 === o2;
        };
    }
    DetalleComboComponent.prototype.ngOnInit = function () {
        this.updateGrupos();
        this.mobile = this.platform.is('cordova');
        this.id = this.navParams.get('idcombo');
        this.comboCollection = this.angularFirestore.collection('combos');
        if (this.id) {
            this.updateCombo();
        }
        else {
            this.combo = {};
            this.form();
        }
    };
    DetalleComboComponent.prototype.updateCombo = function () {
        var _this = this;
        var comboDocument = this.comboCollection.doc(this.id);
        comboDocument.valueChanges().subscribe(function (combo) {
            _this.combo = combo;
            _this.updateProductos(_this.combo.grupo.id);
            _this.form();
        });
    };
    DetalleComboComponent.prototype.form = function () {
        var _this = this;
        this.todo = this.formBuilder.group({
            imagen: [this.combo.imagen],
            grupo: [this.combo.grupo, Validators.required],
            nombre: [{ value: this.combo.nombre, disabled: this.id }, Validators.required, this.valorUnico()],
            productos: [this.combo.producto, Validators.required]
        });
        this.todo.get('grupo').valueChanges.subscribe(function (data) {
            _this.updateProductos(data.id);
        });
    };
    DetalleComboComponent.prototype.valorUnico = function () {
        var _this = this;
        return function (control) {
            if (Validators.required(control))
                return null;
            return new Promise(function (resolve) {
                if (!_this.id) {
                    var id = control.value;
                    var comboDocument = _this.comboCollection.doc(id);
                    comboDocument.get().subscribe(function (data) {
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
    DetalleComboComponent.prototype.sacarFoto = function () {
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
            var fileRef = _this.storage.ref(_this.filePathImage);
            fileRef.putString(imagen, firebase.storage.StringFormat.DATA_URL).then(function () {
                fileRef.getDownloadURL().subscribe(function (data) {
                    _this.todo.patchValue({ imagen: data });
                });
            });
        }).catch(function (err) { return alert('Upload Failed' + err); });
    };
    DetalleComboComponent.prototype.cargarImagen = function () {
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
            var fileRef = _this.storage.ref(_this.filePathImage);
            fileRef.putString(imagen, firebase.storage.StringFormat.DATA_URL).then(function () {
                fileRef.getDownloadURL().subscribe(function (data) {
                    _this.todo.patchValue({ imagen: data });
                });
            });
        }).catch(function (err) { return alert('Upload Failed' + err); });
    };
    DetalleComboComponent.prototype.seleccionarImagen = function (event) {
        var _this = this;
        var imagen = event.target.files[0];
        var fileRef = this.storage.ref(this.filePathImage);
        var task = this.storage.upload(this.filePathImage, imagen);
        task.snapshotChanges().pipe(finalize(function () {
            fileRef.getDownloadURL().subscribe(function (data) {
                _this.todo.patchValue({ imagen: data });
            });
        })).subscribe();
    };
    DetalleComboComponent.prototype.updateFilePath = function () {
        var id = this.todo.value.nombre;
        this.filePathImage = id ? 'combos/' + id : null;
    };
    DetalleComboComponent.prototype.cerrar = function () {
        this.modalController.dismiss();
    };
    DetalleComboComponent.prototype.guardar = function () {
        var _this = this;
        var combo = this.todo.value;
        combo.id = combo.nombre;
        var comboDocument = this.comboCollection.doc(combo.id);
        this.presentLoading();
        comboDocument.set(combo).then(function () {
            _this.presentToast('El combo ha sido registrado');
            _this.loading.dismiss();
        }).catch(function (err) {
            _this.presentAlertError(err, 'registrar');
            _this.loading.dismiss();
        });
    };
    DetalleComboComponent.prototype.eliminar = function () {
        this.presentAlertEliminar();
    };
    DetalleComboComponent.prototype.presentAlertEliminar = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Eliminar combo',
                            message: "\u00BFEst\u00E1 seguro de eliminar el combo " + this.id + "?",
                            buttons: [{
                                    text: 'Si',
                                    handler: function () {
                                        var comboDocument = _this.comboCollection.doc(_this.id);
                                        _this.presentLoading();
                                        comboDocument.delete().then(function () {
                                            _this.presentToast('El combo ha sido eliminado');
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
    DetalleComboComponent.prototype.presentToast = function (mensaje) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastController.create({
                            message: mensaje,
                            duration: 3000
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        this.cerrar();
                        return [2 /*return*/];
                }
            });
        });
    };
    DetalleComboComponent.prototype.presentLoading = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.loadingController.create({
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
    DetalleComboComponent.prototype.presentAlertError = function (err, tipo) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Ha ocurrido un error',
                            subHeader: "Se present\u00F3 un error al " + tipo + " el combo.",
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
    DetalleComboComponent.prototype.updateGrupos = function () {
        var _this = this;
        var grupoCollection = this.angularFirestore.collection('grupos', function (ref) { return ref.orderBy('nombre'); });
        grupoCollection.valueChanges().subscribe(function (grupos) {
            _this.grupos = grupos;
        });
    };
    DetalleComboComponent.prototype.updateProductos = function (grupo) {
        var _this = this;
        var productoCollection = this.angularFirestore.collection('productos', function (ref) { return ref.where('grupo.id', '==', grupo); });
        productoCollection.valueChanges().subscribe(function (productos) {
            _this.productos = productos;
        });
    };
    DetalleComboComponent = tslib_1.__decorate([
        Component({
            selector: 'app-detalle-combo',
            templateUrl: './detalle-combo.component.html',
            styleUrls: ['./detalle-combo.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AlertController,
            AngularFirestore,
            Camera,
            FormBuilder,
            LoadingController,
            ModalController,
            NavParams,
            Platform,
            AngularFireStorage,
            ToastController])
    ], DetalleComboComponent);
    return DetalleComboComponent;
}());
export { DetalleComboComponent };
//# sourceMappingURL=detalle-combo.component.js.map