import GeoTIFF from 'ol/source/GeoTIFF';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/WebGLTile';
import View from 'ol/View';
import OSM from 'ol/source/OSM'
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';


import filetif from './COPERNICUS_EUDEM_165252.tif'

//Registrare la definizione del Sistema di referimento perchè probabile che OpenLayers non la conosca
proj4.defs(
  'EPSG:32633','+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
);
register(proj4);

let legend = [
  -9999,'#00000000',  //Nodata=-9999 transparent
  0, "#000000",    //MinValue   Black
  150,"#ffffff"   //MaxValue    White
];

const BlackToWhite = {
  color: [
    'case',
    ['==', ['band', 2], 0],
    '#00000000',
    [
    'interpolate',['linear'],
    ['band', 1],
    ...legend
]],
}


const source = new GeoTIFF({
  sources: [
    {
      url: filetif,
      projection: 'EPSG:32633',
    },
  ],
  normalize: false,
  interpolate: false,
  transition: 0,
});

const map = new Map({
  target: 'map',
  layers: [

    new TileLayer({
        visible: true,
        preload: Infinity,
        source: new OSM()
      }),

      new TileLayer({
        source: source,
        style: BlackToWhite
      }),

],
  view: new View({

      projection: 'EPSG:32633',
      center:[306821.2,4879578.4],
      zoom:13

  })
});
