import DragAndDrop from 'ol/interaction/DragAndDrop';
import Draw from 'ol/interaction/Draw';
import GeoJSON from 'ol/format/GeoJSON';
import Link from 'ol/interaction/Link';
import Map from 'ol/Map';
import Modify from 'ol/interaction/Modify';
import Snap from 'ol/interaction/Snap';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Fill, Stroke, Style} from 'ol/style';

import {getColor} from './color-function';

const map = new Map({
  target: 'map-container',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

map.addInteraction(new Link());

// Add DragAndDrop GeoJSON to the map
const source = new VectorSource();

const layer = new VectorLayer({
  source: source,
  style: function (feature) {
    return new Style({
      fill: new Fill({
        color: getColor(feature),
      }),
      stroke: new Stroke({
        color: 'rgba(255,255,255,0.8)',
      }),
    });
  },
});

map.addLayer(layer);

map.addInteraction(
  new DragAndDrop({
    source: source,
    formatConstructors: [GeoJSON],
  }),
);

// Add modifying features
map.addInteraction(
  new Modify({
    source: source,
  }),
);

// Draw - adding new features
map.addInteraction(
  new Draw({
    type: 'Polygon',
    source: source,
  }),
);

// Snapping
map.addInteraction(
  new Snap({
    source: source,
  }),
);

// Clearing added features from VectorSource

const clear = document.getElementById('clear');

clear.addEventListener('click', function () {
  source.clear();
});

// Serialize and download data from VectorSource
const format = new GeoJSON({featureProjection: 'EPSG:3857'});

const download = document.getElementById('download');

source.on('change', function () {
  const features = source.getFeatures();
  const json = format.writeFeatures(features);
  download.href =
    'data:application/json;charset=utf-8,' + encodeURIComponent(json);
});
