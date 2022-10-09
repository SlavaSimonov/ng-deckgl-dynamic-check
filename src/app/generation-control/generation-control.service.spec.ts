import { TestBed } from '@angular/core/testing';

import { GenerationControlService } from './generation-control.service';

describe('GenerationControlService', () => {
  let service: GenerationControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerationControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
