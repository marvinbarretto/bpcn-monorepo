import { TestBed } from '@angular/core/testing';

import { FeatureFlagService } from './feature-flag.service';

describe('FeatureFlagsService in dev', () => {
  let service: FeatureFlagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: { production: false, featureFlags: { news: false } } }
      ]
    });
    service = TestBed.inject(FeatureFlagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should always return true for any flag in development', () => {
    expect(service.isEnabled('news')).toBe(true);
  });
});

describe('FeatureFlagsService in prod', () => {
  let service: FeatureFlagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeatureFlagService,
        {
          provide: 'environment',
          useValue: {
            production: true,
            featureFlags: {
              events: false, news: false, login: true
            }
          }
        }
      ]
    });
    service = TestBed.inject(FeatureFlagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the correct flag value', () => {
    expect(service.isEnabled('news')).toBe(false);
    expect(service.isEnabled('events')).toBe(false);
    expect(service.isEnabled('login')).toBe(true);
  });
});
