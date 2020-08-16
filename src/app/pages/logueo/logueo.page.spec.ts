import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogueoPage } from './logueo.page';

describe('LogueoPage', () => {
  let component: LogueoPage;
  let fixture: ComponentFixture<LogueoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogueoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LogueoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
