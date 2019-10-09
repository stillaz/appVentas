import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboPage } from './combo.page';

describe('ComboPage', () => {
  let component: ComboPage;
  let fixture: ComponentFixture<ComboPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComboPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
