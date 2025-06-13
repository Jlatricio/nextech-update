// top-loading-bar.component.ts
import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-loading-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="top-bar" *ngIf="progress > 0 && progress < 100">
      <div class="bar" [style.width.%]="progress"></div>
    </div>
  `,
  styles: [`
   .top-bar {
  height: 4px;
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  overflow: hidden;
}

.bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #007bff, #00e1ff, #8e8eff, #6f42c1);
  background-size: 300% 100%;
  animation: gradientShift 2s linear infinite, glow 1.5s ease-in-out infinite;
  transition: width 0.4s ease-in-out;
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.7);
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5), 0 0 10px rgba(0, 225, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.8), 0 0 20px rgba(142, 142, 255, 0.5);
  }
  100% {
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5), 0 0 10px rgba(0, 225, 255, 0.3);
  }
}

  `]
})
export class TopLoadingBarComponent implements OnDestroy {
    @Input() progress: number = 0;
  private sub: Subscription;

  constructor(private loadingBar: LoadingBarService) {
    this.sub = this.loadingBar.progress$.subscribe(p => this.progress = p);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
