import { Injectable } from '@angular/core';
import { GenerationConfig } from '../generation-control/generation-config';
import { GenerationControlService } from '../generation-control/generation-control.service';

const GEN_CONFIG_ITEM = 'generationConfig';

@Injectable({
  providedIn: 'root'
})
export class ConfigSaverService {

  constructor(genConfigService: GenerationControlService) {
    genConfigService.onGenConfigChange.subscribe(this.saveConfig.bind(this));
  }

  retrieveConfig(): GenerationConfig | undefined {
    const savedData: string | null = localStorage.getItem(GEN_CONFIG_ITEM);
    if (savedData) {
      return JSON.parse(savedData);
    } else {
      return undefined;
    }
  }

  private saveConfig(config: GenerationConfig): void {
    localStorage.setItem(GEN_CONFIG_ITEM, JSON.stringify(config));
  }
}
