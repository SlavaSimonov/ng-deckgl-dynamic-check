import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GenerationConfig } from './generation-config';

@Injectable({
  providedIn: 'root'
})
export class GenerationControlService {
  private static configVersion: number = 0;
  private readonly genConfig$: Subject<GenerationConfig> = new Subject();

  readonly onGenConfigChange: Observable<GenerationConfig> = this.genConfig$.asObservable();

  constructor() { }

  updateConfig(config: GenerationConfig): void {
    GenerationControlService.configVersion++;
    this.genConfig$.next(config);
  }

  currentConfigVersion(): number {
    return GenerationControlService.configVersion;
  }
}
