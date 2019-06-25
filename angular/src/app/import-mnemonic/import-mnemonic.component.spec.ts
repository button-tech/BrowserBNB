import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportMnemonicComponent } from './import-mnemonic.component';

describe('ImportMnemonicComponent', () => {
  let component: ImportMnemonicComponent;
  let fixture: ComponentFixture<ImportMnemonicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportMnemonicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportMnemonicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
