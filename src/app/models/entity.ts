import { Color, Position,  } from "@deck.gl/core/typed";

export interface Entity {
    layerId: number;
    name: string;
    icon: string;
    isSelected: boolean;
    color: Color,
    center: Position;
    polygon: Position[];
}