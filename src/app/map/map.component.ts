import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Map as Maplibre, IControl } from 'maplibre-gl';
import { EntityGeneratorService } from 'src/app/entity-generator/entity-generator.service';
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox/typed';
import { Entity } from 'src/app/models/entity';
import { EntityLayer } from 'src/app/layers/entity-layer';
import { groupBy } from "lodash";
import { SelectedColor } from 'src/app/consts/entity-colors';
import { workerFunc } from './map.worker';
import { Layer } from '@deck.gl/core/typed';
import { EntityBinData } from '../models/entity-bin-data';
import { GenerationControlService } from '../generation-control/generation-control.service';
import { TooltipContent } from '@deck.gl/core/typed/lib/tooltip';
import { MetricsDataService } from '../metrics/metrics-data.service';
import { DeckMetrics } from '@deck.gl/core/typed/lib/deck';

const MapWorker: Worker | undefined = typeof Worker !== 'undefined'
  ? new Worker(URL.createObjectURL(new Blob(["(" + workerFunc.toString() + ")()"], { type: 'text/javascript' })))
  : undefined;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  isLoading: boolean = false;
  map?: Maplibre;
  overlay?: DeckOverlay;
  layers: Map<number, Layer> = new Map();

  constructor(private entitiesService: EntityGeneratorService,
              private genControlService: GenerationControlService,
              private metricsDataService: MetricsDataService) {
    if (MapWorker) {
      MapWorker.onmessage = ({ data }) => {
        this.updateLayer(data);
      };
    }

    this.genControlService.onGenConfigChange.subscribe(_ => {
      this.layers.clear();
      this.isLoading = true;
      this.renderLayers();
    });
  }

  ngAfterViewInit(): void {
    this.map = new Maplibre({
      container: this.mapContainer.nativeElement,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-74.5, 40],
      zoom: 5
    });
    this.overlay = new DeckOverlay({
      getTooltip: ({ object }) => this.getTooltip(object?.name),
      _onMetrics: (metrics: DeckMetrics) => this.metricsDataService.updateMetrics(metrics),
    });
    this.map?.addControl(this.overlay as unknown as IControl);
    this.entitiesService.onEntitiesUpdated$.subscribe(data => this.onDataUpdated(data));
  }

  private getTooltip(entityName: string): TooltipContent | null {
    if (entityName) {
      const [layer, index] = entityName.split('-');
      return {
        text: `Entity: {Layer id: ${layer.slice(1, -1)}, Index: ${index}}`,
        style: {
          borderRadius: '0.5em',
          backgroundColor: '#0000007F',
          color: 'white'
        }
      };
    } else {
      return null;
    }
  }

  private onDataUpdated(data: Entity[]): void {
    const groupedData = groupBy(data, entity => entity.layerId);
    Object.entries(groupedData)
      .map(([layerId, data]) => MapWorker?.postMessage({
        entities: data,
        layerId,
        SelectedColor,
        configVersion: this.genControlService.currentConfigVersion()
      }));
  }

  private updateLayer(data: EntityBinData & { length: number, layerId: string, configVersion: number }): void {
    if (data.configVersion === this.genControlService.currentConfigVersion()) {
      this.layers.set(Number(data.layerId), new EntityLayer({
        id: `entities-${data.layerId}`,
        length: data.length,
        pickable: true,
        binData: data,
        autoHighlight: true,
        highlightColor: [...SelectedColor.slice(0, 3), 150],
        onClick: (pickingInfo) => {
          this.entitiesService.selectEntity(pickingInfo.object.name);
        }
      }));

      this.renderLayers();
      this.isLoading = false;
    }
  }

  private renderLayers(): void {
    this.overlay?.setProps({ layers: Array.from(this.layers.values()) });
  }
}