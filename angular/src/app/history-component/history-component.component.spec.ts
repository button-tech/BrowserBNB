import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryComponentComponent } from './history-component.component';

describe('HistoryComponentComponent', () => {
  let component: HistoryComponentComponent;
  let fixture: ComponentFixture<HistoryComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
