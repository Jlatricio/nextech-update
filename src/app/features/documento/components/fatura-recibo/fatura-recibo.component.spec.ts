import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaturaReciboComponent } from './fatura-recibo.component';

describe('FaturaReciboComponent', () => {
  let component: FaturaReciboComponent;
  let fixture: ComponentFixture<FaturaReciboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaturaReciboComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaturaReciboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
