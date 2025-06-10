import { TestBed } from '@angular/core/testing';

import { FacturareciboService } from './facturarecibo.service';

describe('FacturareciboService', () => {
  let service: FacturareciboService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturareciboService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
