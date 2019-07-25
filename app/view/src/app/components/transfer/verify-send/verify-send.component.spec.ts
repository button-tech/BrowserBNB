import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifySendComponent } from './verify-send.component';

describe('VerifySendComponent', () => {
  let component: VerifySendComponent;
  let fixture: ComponentFixture<VerifySendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifySendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifySendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
