import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProductoPage } from './producto.page';
import { MenuComponent } from './menu/menu.component';
import { InventarioComponent } from './inventario/inventario.component';
var routes = [
    {
        path: '',
        component: ProductoPage
    }
];
var ProductoPageModule = /** @class */ (function () {
    function ProductoPageModule() {
    }
    ProductoPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes),
                ReactiveFormsModule
            ],
            declarations: [ProductoPage, InventarioComponent, MenuComponent],
            entryComponents: [InventarioComponent, MenuComponent]
        })
    ], ProductoPageModule);
    return ProductoPageModule;
}());
export { ProductoPageModule };
//# sourceMappingURL=producto.module.js.map