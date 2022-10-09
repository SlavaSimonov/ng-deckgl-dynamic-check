export interface EntityBinData {
    centers: Float32Array;
    pointColors: Uint8Array;
    pointStrokeWidths: Uint8Array;
    path: Float32Array;
    pathStartIndices: Uint32Array;
    pathColor: Uint8Array;
    pathWidths: Uint8Array;
    texts: Uint16Array;
    textsPositions: Float32Array;
    textsColors: Float32Array;
    textsIndices: Uint32Array;
}
