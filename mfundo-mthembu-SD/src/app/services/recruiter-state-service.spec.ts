import { TestBed } from '@angular/core/testing';

import { RecruiterStateService } from './recruiter-state-service';

describe('RecruiterStateService', () => {
  let service: RecruiterStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecruiterStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
