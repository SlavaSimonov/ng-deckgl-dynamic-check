*** Angular + Deck.GL + MapLibre Dynamic Entities load test ***

[ng-deckgl-dynamic-check](https://slavasimonov.github.io/ng-deckgl-dynamic-check/)

- - -

## Project Description

This project is an [Angular](https://angular.io/) client, that uses [MapLibre](https://maplibre.org/) and [Deck.GL](https://deck.gl/) to render a large quantity of entities on a map, where each entity has a point, icon, label and some have polygon.All entities are dynamic and change position every now and then. Entities geometries are generated randomly using [TurfJS](https://turfjs.org/) random package.

## Motivation

This is a testing and a learning project. I don't pretend to have been using the best of practices since I didn't have experience with deck.gl beforehand. The main aim of the project is to check and test deck.gl performance in this particular scenario - large quantities of dynamic 2d objects. 

## Implementation details

### Deck.GL layers

Entities are drawn using following layers:
* [ScatterplotLayer](https://deck.gl/docs/api-reference/layers/scatterplot-layer) - for points
* [IconLayer](https://deck.gl/docs/api-reference/layers/icon-layer) - for icons
* [TextLayer](https://deck.gl/docs/api-reference/layers/text-layer) - for labels
* [PathLayer](https://deck.gl/docs/api-reference/layers/path-layer) - for polygons

### Composite Layer

[Composite Layer](https://deck.gl/docs/api-reference/core/composite-layer) is used to compose Deck.GL primitive layers into one. I followed [this official guide](https://deck.gl/docs/developer-guide/custom-layers/composite-layers) to implement it

### Performance Optimization

Initially performance was not great, so I've followed [this performance optimization guide](https://deck.gl/docs/developer-guide/performance) and implemented direct supply of binary attributes to the layers. [Typed Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) calculation happens in a separate [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). It improved the performance significantly. As I understand deck.gl does these calculations on a main thread, but when attributes provided directly as TypedArrays deck.gl sends them straight to GPU shaders.

## Plans for this repo

* Implement this same visualization process with other spacial mapping frameworks like Leaflet, Cesium, etc. to be able to compare their performance head-to-head and be able to evaluate which of them is the best for the above described scenario