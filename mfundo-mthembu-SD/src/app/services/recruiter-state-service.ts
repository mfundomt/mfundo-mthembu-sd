import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecruiterStateService {
  private isRecruiterMode = new BehaviorSubject<boolean>(false);
  isRecruiterMode$ = this.isRecruiterMode.asObservable();

  setRecruiterMode(isRecruiter: boolean): void {
    this.isRecruiterMode.next(isRecruiter);
  }
}
