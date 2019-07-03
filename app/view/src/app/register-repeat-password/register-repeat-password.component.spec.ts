import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRepeatPasswordComponent } from './register-repeat-password.component';

describe('RegisterRepeatPasswordComponent', () => {
  let component: RegisterRepeatPasswordComponent;
  let fixture: ComponentFixture<RegisterRepeatPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterRepeatPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterRepeatPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
