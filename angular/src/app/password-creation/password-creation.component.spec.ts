import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordCreationComponent } from './password-creation.component';

describe('PasswordCreationComponent', () => {
  let component: PasswordCreationComponent;
  let fixture: ComponentFixture<PasswordCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
