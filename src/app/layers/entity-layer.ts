import { CompositeLayer, Layer, LayersList, GetPickingInfoParams, PickingInfo } from "@deck.gl/core/typed";
import { ScatterplotLayer, TextLayer, IconLayer, PathLayer } from "@deck.gl/layers/typed";
import { SelectedColor } from "../consts/entity-colors";
import { IconMappingNames, ICON_MAPPING } from "../consts/icon-mapping";
import { EntityBinData } from "../models/entity-bin-data";


interface EntityProps {
  binData: EntityBinData;
  length: number;
}

export class EntityLayer extends CompositeLayer<Required<EntityProps>> {

  renderLayers(): LayersList | Layer<{}> | null {
    const { binData, length } = this.props;
    return [
      new PathLayer({
        data: {
          length,
          startIndices: binData.pathStartIndices,
          attributes: {
            getPath: { value: binData.path, size: 2 },
            getColor: { value: binData.pathColor, size: 4 },
            getWidth: { value: binData.pathWidths }
          }
        },
        pickable: false,
        widthUnits: 'pixels',
        positionFormat: 'XY',
        _pathType: 'loop'
      }, this.getSubLayerProps({ id: 'polygon' })),
      new ScatterplotLayer({
        data: {
          length,
          attributes: {
            getPosition: { value: binData.centers, size: 2 },
            getFillColor: { value: binData.pointColors, size: 4 },
            getLineWidth: { value: binData.pointStrokeWidths }
          }
        },
        pickable: true,
        stroked: true,
        filled: true,
        radiusUnits: 'pixels',
        lineWidthUnits: 'pixels',
        positionFormat: 'XY',
        getRadius: 15,
        getLineColor: SelectedColor,
      }, this.getSubLayerProps({ id: `point` })),
      new IconLayer({
        data: {
          length,
          attributes: {
            getPosition: { value: binData.centers, size: 2 },
          }
        },
        pickable: false,
        iconAtlas: '/assets/spy.png',
        iconMapping: ICON_MAPPING,
        sizeScale: 1,
        getSize: 20,
        positionFormat: 'XY',
        getIcon: _ => IconMappingNames.spy,
      }, this.getSubLayerProps({
        id: `icon`,
      })),
      new TextLayer({
        data: {
          length,
          startIndices: binData.textsIndices,
          attributes: {
            getPosition: { value: binData.textsPositions, size: 2 },
            getText: { value: binData.texts },
            getColor: { value: binData.textsColors, size: 4 }
          }
        },
        pickable: false,
        sizeUnits: 'pixels',
        fontFamily: 'Droid, Arial',
        fontSettings: { sdf: true },
        outlineWidth: 0.5,
        outlineColor: [255, 255, 255],
        getSize: 20,
        getAngle: 0,
        getTextAnchor: 'start',
        getPixelOffset: [18, -10],
        getAlignmentBaseline: 'center'
      }, this.getSubLayerProps({
        id: `text`
      })
      )
    ];
  }

  override getPickingInfo({ info }: GetPickingInfoParams): PickingInfo & Partial<EntityProps> {
    if (info.index >= 0 && info.index < this.props.length) {
      const name = String.fromCharCode(...this.props.binData.texts.subarray(this.props.binData.textsIndices[info.index], this.props.binData.textsIndices[info.index + 1]));
      info.object = { name };
    }
    return info;
  }
}