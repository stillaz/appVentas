import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVentaPage } from './reporte-venta.page';

describe('ReporteVentaPage', () => {
  let component: ReporteVentaPage;
  let fixture: ComponentFixture<ReporteVentaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteVentaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteVentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
