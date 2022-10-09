/// <reference lib="webworker" />

import { SelectedColor } from "../consts/entity-colors";
import { Entity } from "../models/entity";
import { EntityBinData } from "../models/entity-bin-data";

export function workerFunc() {
  addEventListener('message', ({ data }: { data: { entities: Entity[], layerId: number, SelectedColor: typeof SelectedColor, configVersion: number } }) => {
    const { entities, layerId, configVersion, SelectedColor } = data;
    const binaryData: EntityBinData = {
      centers: new Float32Array(entities.flatMap(({ center }) => center as number[])),
      pointColors: new Uint8Array(entities.flatMap(({ color }) => color as number[])),
      pointStrokeWidths: new Uint8Array(entities.map(({ isSelected }) => isSelected ? 5 : 0)),

      path: new Float32Array(entities.map(({ polygon }) => polygon as number[][]).flat(2)),
      pathStartIndices: new Uint32Array(entities.reduce((indices, { polygon }) => {
        const lastIndex = indices[indices.length - 1];
        indices.push(lastIndex + (polygon?.length ?? 0));
        return indices;
      }, [0])),
      pathColor: new Uint8Array(entities.map(({ polygon, isSelected, color }) => polygon.map(_ => (isSelected ? SelectedColor : color) as number[])).flat(2)),
      pathWidths: new Uint8Array(entities.map(({ polygon, isSelected }) => polygon.map(_ => isSelected ? 5 : 2)).flat(2)),

      texts: new Uint16Array(entities.flatMap(({ name }) => Array.from(name).map(c => c.charCodeAt(0)))),
      textsPositions: new Float32Array(entities.map(({ name, center }) => Array.from(name).map(_ => center as number[])).flat(2)),
      textsColors: new Float32Array(entities.map(({ name }) => Array.from(name).map(_ => [0, 0, 0, 255])).flat(2)),
      textsIndices: new Uint32Array(entities.reduce((indices, { name }) => {
        const lastIndex = indices[indices.length - 1];
        indices.push(lastIndex + name.length);
        return indices;
      }, [0])),
    };

    // send back to main thread
    postMessage({ length: entities.length, layerId, configVersion, ...binaryData }, Object.values(binaryData).map(bin => bin.buffer));
  });
}
