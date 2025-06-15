import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RectificacaoComponent } from './rectificacao.component';

describe('RectificacaoComponent', () => {
  let component: RectificacaoComponent;
  let fixture: ComponentFixture<RectificacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RectificacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RectificacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
