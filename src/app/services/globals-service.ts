import { Injectable } from "@angular/core"
import { CustumObdArgsByMe } from "../shared/obd2-data"
import { Coordinates } from "./map-service"
import { ElectronService } from 'ngx-electron'
import { HttpClient } from '@angular/common/http'
import { GlobalSettings } from '../shared/global-settings'
import * as fs from 'fs'
import path from 'path'


@Injectable()
export class GlobalsService {
  public globalSettings: GlobalSettings//: IGlobalSettings
  public time: Date
  public temperature: string = '-'
  public obd

  private travelled = 0
  private fs: typeof fs
  private path: typeof path
  private spawn
  private appPath: string

  constructor(private electronService: ElectronService, private http: HttpClient) {
    this.appPath = this.electronService.remote.app.getAppPath()
    console.log(this.appPath)
    //this.globalSettings = window.require('dist/OBD2OnboardComputer/browser/assets/settings.json')
    //this.globalSettings = settingJSON

    //console.log(this.globalSettings)
    //console.log(this.electronService.isX64)
    //this.electronService.process?.require('fs')
    this.fs = window.require('fs')
    this.path = window.require('path')
    this.globalSettings = this.loadSettings()
    this.obd = window.require('obd2-over-serial')
    this.spawn = window.require('child_process').spawn
    this.initOBDReader()
    //console.log(BrowserWindow)

    this.time = new Date()
    setInterval(() => this.time = new Date(), this.globalSettings.time.refreshInterval)

    async () =>  {
      this.temperature = await this.getTemperature()
    }
    setInterval(async () => this.temperature = await this.getTemperature(), this.globalSettings.temp.refreshInterval)
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

  public getSongs(path?: string): string[] {
    //return this.getServerData(this.globalSettings.api.mp)

    // const dirPath = this.path.join(this.appPath, this.globalSettings.mp.fileDir)
    const dirPath = this.globalSettings.mp.fileDir
    console.log(dirPath)

    return this.fs.readdirSync(dirPath)
  }
  public getSongPath(src: string): string {
    return this.path.join(this.globalSettings.mp.fileDir, src)
  }

  public getOBD2Data(): CustumObdArgsByMe {
    //return this.getServerData(this.globalSettings.api.obd)

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
    //return this.getServerData(this.globalSettings.api.gps)

    return {
      lat: 47.7808951240949,
      lng: 18.8821291923523
    }
  }




  private async getTemperature(): Promise<string> {
    const location = this.getGpsLocation()
    const data = await this.getServerData(this.globalSettings.api.temp, {
      lat: location.lat,
      lon: location.lng,
      appid: '64c65fd025c5e450adcac863f0b341a4'
    }, false)

    return `${data.name} [${data.sys.country}] ${parseFloat((data.main.temp - 273.15).toPrecision(this.globalSettings.temp.precision))} °C`


    //return parseFloat((Math.random() * 20).toFixed(this.globalSettings.temp.precision))
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

  private initOBDReader() {
    /*this.obd = new this.obd(this.globalSettings.obd.port, this.globalSettings.obd.options)

    const self = this

    this.obd.on('connected', function (data: OBDCollector) {
      console.log(data)
      for (const poller in self.globalSettings.obd.pollers)
        self.obd.addPoller(poller)

      self.obd.startPolling(self.globalSettings.obd.refreshInterval) //Polls all added pollers each x ms.
    });
    
    setTimeout(() => {
      try {
        this.obd.connect()
      }
      catch (err) {
        console.log(err)
        this.obd = null
      }
    }, 1000)*/

    // this.obd = this.spawn('node', [this.path.join(this.appPath, 'obd.js')])
    this.obd = this.spawn('node', [this.path.join(this.appPath, 'obd.mock.js')])
    this.obd.stdout.setEncoding('utf8')
    this.obd.stderr.setEncoding('utf8')
    this.obd.stdout.on('data', (data: any) => {
      console.log(data)
      console.log(typeof data)
    })
    this.obd.stderr.on('data', (data: any) => {
      console.log(data)
    })


  }

}
