
import {Raster as RasterSource, GeoTIFF} from 'ol/source'
import Map from 'ol/Map';
import { WebGLTile as TileLayer } from 'ol/layer'
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
    ['==', ['band', 2], 0],  //se la banda2 == 0 (indica i nodata)
    '#00000000',             //allora pixel trasparente
    ['interpolate', ['linear'], ['band', 1], ...legend ]  //altrimenti interploazione lineare banda1 colori della legenda
],
}

const FloodStyle = {
  variables: {
      level: 0,
  },
  color: [
    'case',
    ['==', ['band', 2], 0],  //se la banda2 == 0 (indica i nodata)
    '#00000000',             //allora pixel trasparente
    ["case",  ["<=", ["band",1], ["var", "level"]   ], "#0000ffaa", '#00000000' ]  //se la banda1 è <= livello è blu altrimenti trasparente
],
}

const elevation = new GeoTIFF({
  sources: [
    {
      url: filetif,
      projection: 'EPSG:32633',
    },
  ],
  normalize: false,   //importante
  interpolate: false, //importante
  transition: 0,
});

const osm = new TileLayer({
  visible: true,
  preload: Infinity,
  source: new OSM()
})

const dem = new TileLayer({
  source: elevation,
  style: BlackToWhite , //FloodStyle
})


const map = new Map({
  target: 'map',
  layers: [

      osm,

      dem

],
  view: new View({

      projection: 'EPSG:32633',
      center:[306821.2,4879578.4],
      zoom:13

  })
});


const control = document.getElementById('level');
const output  = document.getElementById('output');
control.addEventListener('input', function () {
  output.innerText = control.value;
  dem.updateStyleVariables({level: parseFloat(control.value)});
});
output.innerText = control.value;