import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPasswordComponent } from './register-password.component';

describe('PasswordCreationComponent', () => {
  let component: RegisterPasswordComponent;
  let fixture: ComponentFixture<RegisterPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
