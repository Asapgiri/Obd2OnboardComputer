import { Injectable } from "@angular/core";
//import * as L from 'leaflet'
import mapboxgl, { Coordinate } from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
//import { MBTiles } from 'leaflet-tilelayer-mbtiles-ts';
import { GlobalsService } from "./globals-service";

export type Coordinates = {
  lat: number,
  lng: number
}

const defaultZoom: number = 8

@Injectable()
export class MapService {
  private coordinates: Coordinates
  private map: mapboxgl.Map
    
  constructor(private globalService: GlobalsService) {
    this.coordinates = this.globalService.globalSettings.map.lastCoordinates
    this.getCoordinates()
  }

  public generateMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXNhMjkiLCJhIjoiY2t1ZGl5a2w5MWF5czJubW83djFvZnkxbSJ9.WjYhlQPSdjbFKZRR92RS5Q';
    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [this.coordinates.lng, this.coordinates.lat], // starting position [lng, lat]
      zoom: this.globalService.globalSettings.map.defaultZoom // starting zoom
    });

    this.map.loadImage('assets/location-icon.png', (error: any, image: any) => {
        if (error) throw error;
      if (!this.map.hasImage('location-image')) {
          this.map.addImage('location-image', image as ImageBitmap, {});
        }
    });

    this.map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl as any
        })
    );

  }


  public getCoordinates(fn?: (coords: Coordinates) => void): void {
    this.coordinates = this.globalService.getGpsLocation()
    if (fn) fn(this.coordinates)
    //this.map.setCenter(this.coordinates)
  }

}
