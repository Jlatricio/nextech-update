import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private loadingFinishedSubject = new BehaviorSubject<boolean>(false);
  loadingFinished$ = this.loadingFinishedSubject.asObservable();

  startLoading(): void {
    this.loadingSubject.next(true);
    this.loadingFinishedSubject.next(false);
  }

  finishLoading(): void {
    this.loadingSubject.next(false);
    this.loadingFinishedSubject.next(true);
  }

  reset(): void {
    this.loadingFinishedSubject.next(false);
  }
}
