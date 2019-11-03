import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CosmosComponent } from './cosmos.component';

describe('CosmosComponent', () => {
  let component: CosmosComponent;
  let fixture: ComponentFixture<CosmosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CosmosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CosmosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
