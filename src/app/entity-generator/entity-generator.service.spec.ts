import { TestBed } from '@angular/core/testing';

import { EntityGeneratorService } from './entity-generator.service';

describe('EntityFetcherService', () => {
  let service: EntityGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
