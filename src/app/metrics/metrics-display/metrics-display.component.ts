import { Component, OnInit } from '@angular/core';
import { DeckMetrics } from '@deck.gl/core/typed/lib/deck';
import { map, Observable } from 'rxjs';
import { MetricsDataService } from '../metrics-data.service';

@Component({
  selector: 'app-metrics-display',
  templateUrl: './metrics-display.component.html',
  styleUrls: ['./metrics-display.component.scss']
})
export class MetricsDisplayComponent implements OnInit {

  metrics: Observable<DeckMetrics> = this.metricsDataService.onMetricsChanged$.pipe(map(this.prepareMetrics));
  constructor(private metricsDataService: MetricsDataService) { }

  ngOnInit(): void {
  }

  private prepareMetrics(metrics:DeckMetrics): DeckMetrics {
    return {
      ...metrics,
      fps: Math.floor(metrics.fps),
      cpuTimePerFrame: Number(metrics.cpuTimePerFrame.toFixed(2)),
      gpuTimePerFrame: Number(metrics.gpuTimePerFrame.toFixed(2)),
      gpuMemory: Math.floor(metrics.gpuMemory / (1024 ** 2)),
    }
  }
}
