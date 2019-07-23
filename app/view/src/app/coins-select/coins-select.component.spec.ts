import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinsSelectComponent } from './coins-select.component';

describe('CoinsSelectComponent', () => {
  let component: CoinsSelectComponent;
  let fixture: ComponentFixture<CoinsSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinsSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
