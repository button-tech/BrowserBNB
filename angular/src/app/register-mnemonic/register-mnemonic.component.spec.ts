import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMnemonicComponent } from './register-mnemonic.component';

describe('CreateComponent', () => {
  let component: RegisterMnemonicComponent;
  let fixture: ComponentFixture<RegisterMnemonicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterMnemonicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterMnemonicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
