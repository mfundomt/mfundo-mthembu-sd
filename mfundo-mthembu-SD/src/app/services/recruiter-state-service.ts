import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecruiterStateService {
  private isRecruiterModeSubject = new BehaviorSubject<boolean>(false);
  isRecruiterMode$ = this.isRecruiterModeSubject.asObservable();

  get isRecruiterMode(): boolean {
    return this.isRecruiterModeSubject.value;
  }

  setRecruiterMode(isRecruiter: boolean): void {
    this.isRecruiterModeSubject.next(isRecruiter);
  }
}
