import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoInputComponent } from './memo-input.component';

describe('MemoInputComponent', () => {
  let component: MemoInputComponent;
  let fixture: ComponentFixture<MemoInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
