import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendientePage } from './pendiente.page';

describe('PendientePage', () => {
  let component: PendientePage;
  let fixture: ComponentFixture<PendientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendientePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
