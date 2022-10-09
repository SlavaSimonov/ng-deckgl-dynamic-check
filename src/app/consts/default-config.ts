import { GenerationConfig } from "../generation-control/generation-config";

export const DefaultGenerationConfig: GenerationConfig = {
    layersCount: 2,
    entitiesInLayer: 1000,
    polygonEntities: 50,
    pointsInPolygon: 10,
    updatingEntities: 50,
    updatingRate: 2,
}
