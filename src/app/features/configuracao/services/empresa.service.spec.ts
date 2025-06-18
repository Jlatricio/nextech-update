import { TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:src/app/features/configuracao/services/empresa.service.spec.ts
import { EmpresaService } from './empresa.service';

describe('EmpresaService', () => {
  let service: EmpresaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpresaService);
========
import { NetworkService } from './network.service';

describe('NetworkService', () => {
  let service: NetworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkService);
>>>>>>>> 1cf9653bea8691ed5a2c7327c02906873e0e2c45:src/app/core/services/network.service.spec.ts
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
