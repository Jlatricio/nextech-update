import { TestBed } from '@angular/core/testing';

import { DocumentoContextService } from './documento-context.service';

describe('DocumentoContextService', () => {
  let service: DocumentoContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentoContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
