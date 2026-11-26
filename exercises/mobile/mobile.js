import Control from 'ol/control/Control';
import Feature from 'ol/Feature';
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import kompas from 'kompas';
import {Fill, Icon, Style} from 'ol/style';
import {Map, View} from 'ol';
import {circular} from 'ol/geom/Polygon';
import {fromLonLat} from 'ol/proj';

const map = new Map({
  target: 'map-container',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: fromLonLat([0, 0]),
    zoom: 2,
  }),
});

// creating a VectorSource
const source = new VectorSource();

const layer = new VectorLayer({
  source: source,
});

map.addLayer(layer);

// Gets geolocation and its accuracy form the browser's geolocation API

navigator.geolocation.watchPosition(
  function (pos) {
    const coords = [pos.coords.longitude, pos.coords.latitude];
    const accuracy = circular(coords, pos.coords.accuracy);
    source.clear(true);
    source.addFeatures([
      new Feature(
        accuracy.transform('EPSG:4326', map.getView().getProjection()),
      ),
      new Feature(new Point(fromLonLat(coords))),
    ]);
  },
  function (error) {
    alert(`ERROR: ${error.message}`);
  },
  {
    enableHighAccuracy: true,
  },
);

// Button that centers the map on that location

const locate = document.createElement('div');
locate.className = 'ol-control ol-unselectable locate';
locate.innerHTML = '<button title="Locate me">◎</button>';

locate.addEventListener('click', function () {
  if (!source.isEmpty()) {
    map.getView().fit(source.getExtent(), {
      maxZoom: 18,
      duration: 500,
    });
  }
});

map.addControl(
  new Control({
    element: locate,
  }),
);

// Add a compass

const style = new Style({
  fill: new Fill({
    color: 'rgba(0, 0, 255, 0.2)',
  }),
  image: new Icon({
    src: '../../data/location-heading.svg',
    rotateWithView: true,
  }),
});

layer.setStyle(style);

function startCompass() {
  kompas()
    .watch()
    .on('heading', function (heading) {
      style.getImage().setRotation((Math.PI / 180) * heading);
    });
}

if (
  window.DeviceOrientationEvent &&
  typeof DeviceOrientationEvent.requestPermission === 'function'
) {
  locate.addEventListener('click', async () => {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();

      if (permission === 'granted') {
        startCompass();
      } else {
        alert('Device orientation permission denied');
      }
    } catch (error) {
      alert(`ERROR: ${error.message}`);
    }
  });
} else if ('ondeviceorientationabsolute' in window) {
  startCompass();
} else {
  alert('No device orientation provided by device');
}
