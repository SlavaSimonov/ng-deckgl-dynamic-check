import { Injectable } from '@angular/core';
import { Color, Position } from '@deck.gl/core/typed';
import { randomPoint, randomPolygon } from '@turf/random';
import { BehaviorSubject, Observable } from 'rxjs';
import { GenerationConfig } from '../generation-control/generation-config';
import { GenerationControlService } from '../generation-control/generation-control.service';
import { Entity } from '../models/entity';

@Injectable({
  providedIn: 'root'
})
export class EntityGeneratorService {
  private entities: Map<string, Entity> = new Map();
  private selectedName: string = '';
  private entities$: BehaviorSubject<Entity[]> = new BehaviorSubject<Entity[]>([]);
  onEntitiesUpdated$: Observable<Entity[]> = this.entities$.asObservable();
  updatingInterval: NodeJS.Timer | undefined;

  constructor(private genControlService: GenerationControlService) {
    this.genControlService.onGenConfigChange.subscribe((config: GenerationConfig) => this.genConfigChanged(config));
  }

  selectEntity(name: string): void {
    const selected: Entity | undefined = this.entities.get(name);
    if (selected) {
      const prevSelected: Entity | undefined = this.entities.get(this.selectedName);
      if (prevSelected) {
        this.entities.set(this.selectedName, { ...prevSelected, isSelected: false });
      }

      this.entities.set(selected.name, { ...selected, isSelected: true });
      this.selectedName = selected.name;

      console.log(`Entity selected: ${name}`);
      this.entities$.next(Array.from(this.entities.values()));
    }
  }

  private genConfigChanged(config: GenerationConfig): void {
    this.entities$.next(this.generateEntities(config.layersCount, config.entitiesInLayer, config.polygonEntities, config.pointsInPolygon));
    this.scheduleUpdating(config.updatingRate, config.updatingEntities);
  }

  private scheduleUpdating(refreshSeconds: number, updatingChance: number): void {
    clearInterval(this.updatingInterval);

    this.updatingInterval = setInterval(() => {
      this.updateRandomEntities(updatingChance);
      this.entities$.next(Array.from(this.entities.values()));
    }, refreshSeconds * 1000);
  }

  private generateEntities(layersAmount: number, count: number, polygonChance: number, pointsInPolygon: number): Entity[] {
    this.entities.clear();
    for (let layerId = 0; layerId < layersAmount; layerId++) {
      const color: Color = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 255];
      const positions: Position[] = randomPoint(count, {bbox: [-180,-80,180,80]}).features
        .map((feature) => feature.geometry.coordinates) as Position[];

      for (let entityIndex = 0; entityIndex < positions.length; entityIndex++) {
        const name: string = `[${layerId}]-${entityIndex}`;
        this.entities.set(name, {
          layerId,
          name,
          center: positions[entityIndex],
          color,
          polygon: [positions[entityIndex], positions[entityIndex], positions[entityIndex]],
          icon: '/assets/entity.png',
          isSelected: false,
        });
      }
    }
    this.addPolygons(polygonChance, pointsInPolygon);
    return Array.from(this.entities.values());
  }

  private addPolygons(chance: number, pointsInPolygon: number): void {
    Array.from(this.entities.values()).forEach((entity: Entity) => {
      if (Math.random() * 100 < chance) {
        const pointsLength: number = Math.round(Math.random() * (pointsInPolygon - 3) + 3);
        const polygon = randomPolygon(1, {
          bbox: [entity.center[0], entity.center[1], entity.center[0], entity.center[1]],
          num_vertices: pointsLength,
          max_radial_length: 0.5
        });
        entity.polygon = polygon.features[0].geometry.coordinates.flat() as Position[];
      }

      return entity;
    });
  }

  private updateRandomEntities(chance: number): void {
    Array.from(this.entities.values()).forEach(entity => {
      if (Math.random() * 100 < chance) {
        const movement: Position = [Math.random() * 0.1 - 0.05, Math.random() * 0.1 - 0.05];
        entity.center = [entity.center[0] + movement[0], entity.center[1] + movement[1]];
        entity.polygon = entity?.polygon?.map(coord => [coord[0] + movement[0], coord[1] + movement[1]]);
      }

      return entity;
    });
  }
}
