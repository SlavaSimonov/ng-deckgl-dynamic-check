import { TestBed } from '@angular/core/testing';

import { ConfigSaverService } from './config-saver.service';

describe('ConfigSaverService', () => {
  let service: ConfigSaverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigSaverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
