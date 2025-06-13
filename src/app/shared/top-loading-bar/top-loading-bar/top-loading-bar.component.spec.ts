import { ComponentFixture, TestBed } from '@angular/core/testing';

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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
