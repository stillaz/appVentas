import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MenuCarritoPage } from './menu-carrito.page';
var routes = [
    {
        path: 'menu',
        component: MenuCarritoPage,
        children: [{ path: 'productos', loadChildren: '../producto/producto.module#ProductoPageModule' },]
    }, {
        path: '',
        redirectTo: 'menu/productos'
    }
];
var MenuCarritoPageModule = /** @class */ (function () {
    function MenuCarritoPageModule() {
    }
    MenuCarritoPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [MenuCarritoPage]
        })
    ], MenuCarritoPageModule);
    return MenuCarritoPageModule;
}());
export { MenuCarritoPageModule };
//# sourceMappingURL=menu-carrito.module.js.map