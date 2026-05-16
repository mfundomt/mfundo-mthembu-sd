import { TestBed } from '@angular/core/testing';

import { CommandModalService } from './command-modal-service';

describe('CommandModalService', () => {
  let service: CommandModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
