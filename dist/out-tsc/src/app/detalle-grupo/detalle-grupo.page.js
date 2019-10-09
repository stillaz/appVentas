import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavParams, Platform, ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Camera } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase';
import { finalize } from 'rxjs/operators';
var DetalleGrupoPage = /** @class */ (function () {
    function DetalleGrupoPage(navParams, angularFirestore, platform, formBuilder, camera, storage, modalController, toastController, loadingController, alertController) {
        this.navParams = navParams;
        this.angularFirestore = angularFirestore;
        this.platform = platform;
        this.formBuilder = formBuilder;
        this.camera = camera;
        this.storage = storage;
        this.modalController = modalController;
        this.toastController = toastController;
        this.loadingController = loadingController;
        this.alertController = alertController;
    }
    DetalleGrupoPage.prototype.ngOnInit = function () {
        this.mobile = this.platform.is('cordova');
        this.id = this.navParams.get('idgrupo');
        this.grupoCollection = this.angularFirestore.collection('grupos');
        if (this.id) {
            this.updateGrupo();
        }
        else {
            this.grupo = {};
            this.form();
        }
    };
    DetalleGrupoPage.prototype.updateGrupo = function () {
        var _this = this;
        var grupoDoc = this.grupoCollection.doc(this.id);
        grupoDoc.valueChanges().subscribe(function (grupo) {
            _this.grupo = grupo;
            _this.form();
        });
    };
    DetalleGrupoPage.prototype.form = function () {
        this.todo = this.formBuilder.group({
            nombre: [{ value: this.grupo.nombre, disabled: this.id }, Validators.required, this.valorUnico()],
            imagen: [this.grupo.imagen]
        });
    };
    DetalleGrupoPage.prototype.valorUnico = function () {
        var _this = this;
        return function (control) {
            if (Validators.required(control))
                return null;
            return new Promise(function (resolve) {
                if (!_this.id) {
                    var id = control.value;
                    var grupoDoc = _this.grupoCollection.doc(id);
                    grupoDoc.get().subscribe(function (data) {
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
    DetalleGrupoPage.prototype.sacarFoto = function () {
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
    DetalleGrupoPage.prototype.cargarImagen = function () {
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
    DetalleGrupoPage.prototype.seleccionarImagen = function (event) {
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
    DetalleGrupoPage.prototype.updateFilePath = function () {
        var id = this.todo.value.nombre;
        this.filePathImage = id ? 'grupos/' + id : null;
    };
    DetalleGrupoPage.prototype.cerrar = function () {
        this.modalController.dismiss();
    };
    DetalleGrupoPage.prototype.guardar = function () {
        var _this = this;
        var grupo = this.todo.value;
        grupo.id = grupo.nombre;
        var grupoDoc = this.grupoCollection.doc(grupo.id);
        this.presentLoading();
        grupoDoc.set(grupo).then(function () {
            _this.presentToast('El grupo ha sido registrado');
            _this.loading.dismiss();
        }).catch(function (err) {
            _this.presentAlertError(err, 'registrar');
            _this.loading.dismiss();
        });
    };
    DetalleGrupoPage.prototype.eliminar = function () {
        this.presentAlertEliminar();
    };
    DetalleGrupoPage.prototype.presentAlertEliminar = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Eliminar grupo',
                            message: "\u00BFEst\u00E1 seguro de eliminar el grupo " + this.id + "?",
                            buttons: [{
                                    text: 'Si',
                                    handler: function () {
                                        var grupoDoc = _this.grupoCollection.doc(_this.id);
                                        _this.presentLoading();
                                        grupoDoc.delete().then(function () {
                                            _this.presentToast('El grupo ha sido eliminado');
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
    DetalleGrupoPage.prototype.presentToast = function (mensaje) {
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
    DetalleGrupoPage.prototype.presentLoading = function () {
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
    DetalleGrupoPage.prototype.presentAlertError = function (err, tipo) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
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
    DetalleGrupoPage = tslib_1.__decorate([
        Component({
            selector: 'app-detalle-grupo',
            templateUrl: './detalle-grupo.page.html',
            styleUrls: ['./detalle-grupo.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [NavParams,
            AngularFirestore,
            Platform,
            FormBuilder,
            Camera,
            AngularFireStorage,
            ModalController,
            ToastController,
            LoadingController,
            AlertController])
    ], DetalleGrupoPage);
    return DetalleGrupoPage;
}());
export { DetalleGrupoPage };
//# sourceMappingURL=detalle-grupo.page.js.map