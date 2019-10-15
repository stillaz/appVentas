import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleInventarioPage } from './detalle-inventario.page';

describe('DetalleInventarioPage', () => {
  let component: DetalleInventarioPage;
  let fixture: ComponentFixture<DetalleInventarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleInventarioPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleInventarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
