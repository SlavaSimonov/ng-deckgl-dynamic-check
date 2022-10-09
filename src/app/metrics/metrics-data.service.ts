import { Injectable } from '@angular/core';
import { DeckMetrics } from '@deck.gl/core/typed/lib/deck';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetricsDataService {

  private readonly metrics$:Subject<DeckMetrics> = new Subject();

  readonly onMetricsChanged$:Observable<DeckMetrics> = this.metrics$.asObservable();

  constructor() { }

  updateMetrics(metrics:DeckMetrics):void {
    this.metrics$.next(metrics);
  }
}
