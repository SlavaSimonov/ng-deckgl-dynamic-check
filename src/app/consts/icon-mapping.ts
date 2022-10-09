import { IconMapping } from "@deck.gl/layers/typed/icon-layer/icon-manager";

export const IconMappingNames = {
  spy: 'spy'
} as const;


export const ICON_MAPPING: { [key in keyof typeof IconMappingNames]: IconMapping[''] } = {
  spy: { x: 0, y: 0, width: 512, height: 512, mask: true }
};