import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AllBalancesComponent} from './all-balances.component';

describe('AllBalancesComponent', () => {
    let component: AllBalancesComponent;
    let fixture: ComponentFixture<AllBalancesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AllBalancesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AllBalancesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
