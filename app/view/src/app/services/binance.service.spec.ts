import { TestBed } from '@angular/core/testing';

import { BinanceService } from './binance.service';

describe('BinanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BinanceService = TestBed.get(BinanceService);
    expect(service).toBeTruthy();
  });
});
