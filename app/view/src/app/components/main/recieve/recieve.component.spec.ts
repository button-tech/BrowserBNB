import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RecieveComponent} from './recieve.component';

describe('RecieveComponent', () => {
    let component: RecieveComponent;
    let fixture: ComponentFixture<RecieveComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RecieveComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RecieveComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
