var request = require('request');
var geolib = require('geolib');
var GeoJSON = require('geojson');
var solver = require('node-tspsolver');
var express = require('express');

var app = express();

app.use(express.static('static'))


