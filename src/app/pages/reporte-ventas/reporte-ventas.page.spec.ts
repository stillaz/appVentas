import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReporteVentasPage } from './reporte-ventas.page';

describe('ReporteVentasPage', () => {
  let component: ReporteVentasPage;
  let fixture: ComponentFixture<ReporteVentasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteVentasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteVentasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
