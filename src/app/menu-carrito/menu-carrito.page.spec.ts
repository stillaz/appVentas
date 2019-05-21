import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCarritoPage } from './menu-carrito.page';

describe('MenuCarritoPage', () => {
  let component: MenuCarritoPage;
  let fixture: ComponentFixture<MenuCarritoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuCarritoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCarritoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
