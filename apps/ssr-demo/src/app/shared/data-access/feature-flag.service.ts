import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private flags: { [key: string]: boolean } = { ...environment.featureFlags };

  constructor() {
    console.log('Environment feature flags at service initialization:', environment.featureFlags);
    this.flags = { ...environment.featureFlags };
  }

  isEnabled(flag: keyof typeof environment.featureFlags): boolean {
    if (!environment.production && environment.enableAllFeaturesInDevelopment) return true;

    return this.flags[flag] ?? false; // Default to false if the flag is undefined
  }
}
