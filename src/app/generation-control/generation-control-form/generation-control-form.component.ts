import { Component, OnInit } from '@angular/core';
import { ConfigSaverService } from 'src/app/config-saver/config-saver.service';
import { DefaultGenerationConfig } from 'src/app/consts/default-config';
import { GenerationConfig } from '../generation-config';
import { GenerationControlService } from '../generation-control.service';

@Component({
  selector: 'app-generation-control-form',
  templateUrl: './generation-control-form.component.html',
  styleUrls: ['./generation-control-form.component.scss']
})
export class GenerationControlFormComponent implements OnInit {

  currentDisplayEntities:number = 0;
  genConfig: { [P in keyof GenerationConfig]: GenerationConfig[P] | null; } = DefaultGenerationConfig;

  constructor(private genControlService: GenerationControlService, configSaverService: ConfigSaverService) {
    const localConfig: GenerationConfig | undefined = configSaverService.retrieveConfig();
    if (localConfig) {
      this.applyConfig(localConfig);
    }
  }

  ngOnInit(): void {
    this.applyGenConfig();
  }

  applyGenConfig(): void {
    if (this.isValidGenConfig(this.genConfig)){
      this.genControlService.updateConfig({ ...this.genConfig });
      this.currentDisplayEntities = this.genConfig.entitiesInLayer * this.genConfig.layersCount;
    }
  }

  applyDefaultConfig():void {
    this.applyConfig(DefaultGenerationConfig);
    this.applyGenConfig();
  }

  entitiesCountLabel(value: number): string {
    if (value >= 1000) {
      return `${value / 1000}k`;
    }

    return value.toString();
  }

  percentLabel(value: number): string {
    return `${value}%`;
  }

  secondsLabel(value: number): string {
    return `${value}s`;
  }

  private applyConfig(config: GenerationConfig): void {
    this.genConfig = { ...config };
  }

  private isValidGenConfig(value: any): value is GenerationConfig {
    return value.layersCount &&
      value.entitiesInLayer &&
      value.polygonEntities &&
      value.updatingEntities &&
      value.updatingRate;
  }
}
