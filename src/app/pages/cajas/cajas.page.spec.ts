import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CajasPage } from './cajas.page';

describe('CajasPage', () => {
  let component: CajasPage;
  let fixture: ComponentFixture<CajasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CajasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CajasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
