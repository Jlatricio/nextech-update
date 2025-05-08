import { TestBed } from '@angular/core/testing';

import { ArtigoService } from './artigo.service';

describe('ArtigoService', () => {
  let service: ArtigoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtigoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
