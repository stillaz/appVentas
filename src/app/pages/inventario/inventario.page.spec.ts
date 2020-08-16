import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InventarioPage } from './inventario.page';

describe('InventarioPage', () => {
  let component: InventarioPage;
  let fixture: ComponentFixture<InventarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InventarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
