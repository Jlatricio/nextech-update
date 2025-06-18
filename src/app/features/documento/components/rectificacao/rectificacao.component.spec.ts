import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:src/app/features/documento/components/rectificacao/rectificacao.component.spec.ts
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
========
import { TopLoadingBarComponent } from './top-loading-bar.component';

describe('TopLoadingBarComponent', () => {
  let component: TopLoadingBarComponent;
  let fixture: ComponentFixture<TopLoadingBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopLoadingBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopLoadingBarComponent);
>>>>>>>> 1cf9653bea8691ed5a2c7327c02906873e0e2c45:src/app/shared/top-loading-bar/top-loading-bar/top-loading-bar.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
