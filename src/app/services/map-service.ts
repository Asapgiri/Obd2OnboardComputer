import { Injectable } from "@angular/core";
import * as L from 'leaflet'
import { GPSCollector } from "../shared/types/t-gps-collector";
//import { MBTiles } from 'leaflet-tilelayer-mbtiles-ts';
import { GlobalsService } from "./globals-service";

// declare var L: any

export type Coordinates = {
  lat: number,
  lng: number
}

@Injectable()
export class MapService {
  private coordinates: Coordinates
  private map: L.Map
  private location: L.Marker<any>
  private geojsonLayer: L.GeoJSON<any>
  private canMove: boolean = true
    
  constructor(private gs: GlobalsService) {
    this.coordinates = this.gs.globalSettings.map.lastCoordinates
    this.getCoordinates()
  }

  public generateMap(zoom = true) {
    this.map = L.map('map', { zoomControl: zoom }).setView(this.coordinates, this.gs.globalSettings.map.defaultZoom);

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      // attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: this.gs.globalSettings.map.maxZoom,
      minZoom: this.gs.globalSettings.map.minZoom,
      id: (new Date()).getHours() < 20 && (new Date()).getHours() > 6 ? 'light-v10' : 'dark-v10',
      accessToken: 'pk.eyJ1IjoiYXNhMjkiLCJhIjoiY2t1ZGl5a2w5MWF5czJubW83djFvZnkxbSJ9.WjYhlQPSdjbFKZRR92RS5Q'
    }).addTo(this.map);

    this.location = L.marker(this.coordinates, {
      icon: L.icon({
        iconUrl: 'assets/location-icon.png',
        iconSize: [25, 25]
      })
    }).addTo(this.map)
    this.loadLocation()

    setTimeout(() => {
      this.coordinates = { lat: 47.781594, lng: 18.883087 }
      this.loadLocation()
      console.log('location change to:', this.coordinates)
    }, 10000)

    this.gs.getGpsOutput((data: string) => {
      data.split('\n').forEach(d => {
        if (d) {
          const parsedData = JSON.parse(d) as GPSCollector
          if (parsedData.lon) {
            this.coordinates = { lng: parsedData.lon, lat: parsedData.lat }
            this.loadLocation()
          }
        }
      })
    })
  }

  public loadLocation(): void {
    if (this.canMove) {
      this.location.setLatLng(this.coordinates)
      this.map.panTo(this.coordinates)
    }
  }

  public loadTravelledRoad(): void {
    const route = this.gs.getGpsRoute()
    console.log(route)
    this.geojsonLayer = L.geoJSON(route, {
      style: {
        color: this.gs.globalSettings.mp.colorSceme,
        weight: 8
      }
    }).addTo(this.map)
    this.map.fitBounds(this.geojsonLayer.getBounds());
    this.canMove = false
  }

  public removeBorders(): void {
    document.getElementById('map')?.classList.remove('leaflet-container')
  }

  public destroyMap(): void {
    if (this.map) {
      this.map.off()
      this.map.remove()
    }
  }

  public getCoordinates(fn?: (coords: Coordinates) => void): void {
    this.coordinates = this.gs.getGpsLocation()
    if (fn) fn(this.coordinates)
    //this.map.setCenter(this.coordinates)
  }

}
