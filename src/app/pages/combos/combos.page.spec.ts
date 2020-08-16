import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CombosPage } from './combos.page';

describe('CombosPage', () => {
  let component: CombosPage;
  let fixture: ComponentFixture<CombosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CombosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
