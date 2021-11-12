import { Injectable } from "@angular/core"
import { CustumObdArgsByMe } from "../shared/obd2-data"
import { Coordinates } from "./map-service"
import { ElectronService } from 'ngx-electron'
import { HttpClient } from '@angular/common/http'
import { GlobalSettings } from '../shared/global-settings'
import * as fs from 'fs'
import path, { parse } from 'path'
import { TempType } from "../shared/enums/e-temps"
import { DataSaver } from "./repo/data-saver"
import { OBDCollector } from "../shared/types/t-obd-collector"
import { MediaPlayerService, Song } from "./media-player-service"
import { strict } from "assert/strict"
import { GPSCollector } from "../shared/types/t-gps-collector"
import { MyGeoJSON } from "../shared/types/t-my-geo-json"


@Injectable()
export class GlobalsService {
  public globalSettings: GlobalSettings//: IGlobalSettings
  public time: Date
  public temperature: string = '-'
  public obd: any
  public gps: any
  public usb: any

  private travelled = 0
  private fs: typeof fs
  private path: typeof path
  private spawn
  private appPath: string
  private actualCoordinates: Coordinates
  private dataSaver: DataSaver


  constructor(private electronService: ElectronService, private http: HttpClient) {
    this.appPath = this.electronService.remote.app.getAppPath()
    console.log(this.appPath)

    this.fs = window.require('fs')
    this.path = window.require('path')
    this.globalSettings = this.loadSettings()
    this.spawn = window.require('child_process').spawn
    this.initOBDReader()
    this.actualCoordinates = this.globalSettings.map.lastCoordinates
    this.dataSaver = new DataSaver(this.fs, this.path, this.appPath)
    this.initGPS()
    this.initUSB()

    this.time = new Date()
    setInterval(() => this.time = new Date(), this.globalSettings.time.refreshInterval)

    /*async () =>  {
      this.temperature = await this.getTemperature()
    }
    setInterval(async () => this.temperature = await this.getTemperature(), this.globalSettings.temp.refreshInterval)*/
  }

  public getAppPath(): string {
    return this.appPath
  }

  public saveSettings() {
    this.fs.writeFile(this.path.join(this.appPath, 'settings.json'), JSON.stringify(this.globalSettings), () => {})
  }
  public loadSettings(): GlobalSettings {
    return JSON.parse(this.fs.readFileSync(this.path.join(this.appPath, 'settings.json')).toString())
  }
  public closeWindow(): void {
    window.close()
  }

  public getSongs(path?: string): Song[] {
    // const dirPath = this.path.join(this.appPath, this.globalSettings.mp.fileDir)
    const dirPath = this.globalSettings.mp.fileDir
    console.log(dirPath)

    const songPaths = this.findSongs(this.globalSettings.mp.fileDir)
    let songs: Song[] = []
    songPaths.forEach(song => {
      songs.push({
        pretty: song.slice(song.lastIndexOf('/')+1, song.lastIndexOf('.')),
        src: song
      })
    })
    console.log('GS getSongs:', songs)

    return songs
  }
  private findSongs(dirpath?: string): string[] {
    let songs: string[] = []
    if (!dirpath) dirpath = '/media/pi'

      let files: string[]
    try {
      files = this.fs.readdirSync(dirpath)
    } catch (e) {
      files = []
    }

    files.forEach(file => {
      if (file.indexOf('.') == -1) {
        const dirfiles = this.findSongs(`${dirpath}/${file}`)
        //console.log(dirfiles, dirpath)
        dirfiles.forEach(x => songs.push(x))
      }
      //else console.log(file.split('.')[-1])
      else {
        const fileTmb = file.split('.')
        const ext = fileTmb[fileTmb.length - 1]
        if (ext == 'mp3') {
          //console.log(file)
          songs.push(`${dirpath}/${file}`)
        }
      }
    })
    return songs
  }
  /*public getSongPath(src: string): string {
    return this.path.join(this.globalSettings.mp.fileDir, src)
  }*/

  public getOBD2Data(): CustumObdArgsByMe {
    return {
      speed: Math.floor(Math.random() * 200),
      gear: Math.floor(Math.random() * 6),
      rev: Math.floor(Math.random() * 6000),
      fuelCons: {
        long: (Math.floor(Math.random() * 200)).toString(),
        short: (Math.floor(Math.random() * 200) / 10).toString()
      },
      travelled: this.travelled,
      drivingStyle: 'good',
      drivingTime: this.travelled++
    }
  }

  public getGpsLocation(): Coordinates {
    return this.actualCoordinates
  }

  public getGpsOutput(fn: (data: string) => void): void {
    this.gps.stdout.on('data', fn)
  }

  public getGpsRoute(): MyGeoJSON {
    return this.dataSaver.getGPSData()
  }

  private async getTemperatureOnline(): Promise<string> {
    const location = this.getGpsLocation()
    const data = await this.getServerData(this.globalSettings.api.temp, {
      lat: location.lat,
      lon: location.lng,
      appid: '64c65fd025c5e450adcac863f0b341a4'
    }, false)

    return `${data.name} [${data.sys.country}] ${parseFloat((data.main.temp - 273.15).toPrecision(this.globalSettings.temp.precision))} °C`


    //return parseFloat((Math.random() * 20).toFixed(this.globalSettings.temp.precision))
  }

  public setTemperature(tempC: number): string {
    const tempType = this.globalSettings.temp.type
    let temp
    switch (tempType) {
      case TempType.Celsius: temp = tempC; break
      case TempType.Fahrenheit: temp = tempC * 1.8 + 32; break
      case TempType.Kelvin: temp = tempC + 272.15; break
    }
    return `${parseFloat(temp.toPrecision(this.globalSettings.temp.precision))} ${tempType}`
  }

  private async getServerData(api: string, params?: any, globalApiUrl: boolean = true): Promise<any> {
    let params_back
    if (params) {
      params_back = '?'
      for (const key in params) {
        params_back += `${key}=${params[key]}&`
      }

    }
    const url = `${globalApiUrl ? this.globalSettings.api.url + '/' : ''}${api}${params ? params_back : ''}`
    return await this.http.get<any>(url).toPromise<any>()
  }

  private initOBDReader(): void {
    this.obd = this.spawn('node', [this.path.join(this.appPath, 'obd.js')])
    this.obd.stdout.setEncoding('utf8')
    this.obd.stderr.setEncoding('utf8')
    this.obd.stdout.on('data', (data: string) => {
      console.log('Temp parser data')
      data.split('\n').forEach(d => {
        if (d) {
          console.log(d)
          try {
            const parsedData = JSON.parse(d) as OBDCollector
            if (parsedData.name == 'iat') this.temperature = this.setTemperature(parsedData.value as number)
          }
          catch (e) {
            // TODO: ERROR MESSAGE TO WANNABE LOGGER SOMETIME
          }
        }
      })

      if (this.globalSettings.developerMode) console.log(data)
    })
    this.obd.stderr.on('data', (data: string) => {
      if (data.length < 1000) console.log(typeof data, data)
    })
  }

  private initGPS(): void {
    this.gps = this.spawn('node', [this.path.join(this.appPath, 'gps.js')])
    this.gps.stdout.setEncoding('utf8')
    this.gps.stderr.setEncoding('utf8')
    this.gps.stdout.on('data', (data: string) => {
      data.split('\n').forEach(d => {
        if (d) {
          const parsedData = JSON.parse(d) as GPSCollector
          if (parsedData.lat) this.actualCoordinates = {
            lat: parsedData.lat,
            lng: parsedData.lon
          }
        }
      })
    })
    this.gps.stderr.on('data', (data: string) => {
      if (data.length < 1000) console.log(data)
    })
    this.dataSaver.init(this.gps, this.obd)
  }

  private initUSB(): void {
    this.usb = this.spawn('node', [this.path.join(this.appPath, 'usb.js')])
    this.usb.stdout.setEncoding('utf8')
    this.usb.stderr.setEncoding('utf8')
    this.usb.stderr.on('data', (data: string) => {
      console.log('USB SERVICE ERROR:', data)
    })
  }
}
