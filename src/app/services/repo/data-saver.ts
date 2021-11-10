import * as fs from 'fs'
import path from 'path'
import { GPSCollector } from '../../shared/types/t-gps-collector'
import { OBDCollector } from '../../shared/types/t-obd-collector'

const { buildGPX, GarminBuilder } = window.require('gpx-builder');
const { Point } = GarminBuilder.MODELS;

export class DataSaver {
  private fs: typeof fs
  private path: typeof path
  private gps: any
  private obd: any
  private intervalId: any

  private collectedOBDData: OBDCollector[] = []
  private collectedGPSData: typeof Point[] = []

  private filenameGPX: string = new Date().toISOString().replace(/[ &\/\\#,+()$~%.'":*?<>{}]/g, '-') + '.gpx'
  private filenameOBD: string = new Date().toISOString().replace(/[ &\/\\#,+()$~%.'":*?<>{}]/g, '-') + '.obd.json'

  constructor(_fs: typeof fs, _path: typeof path, private appPath?: string) {
    this.fs = _fs
    this.path = _path
  }

  public init(gps: any, obd: any) {
    this.gps = gps
    this.obd = obd
    this.gps.stdout.on('data', (data: string) => {
      data.split('\n').forEach(d => {
        if (d) {
          console.log('DATA SAVER GPS:', d)
          const parsedData = JSON.parse(d) as GPSCollector
          this.collectedGPSData.push(new Point(parsedData.lat, parsedData.lon, {
            ele: parsedData.alt,
            time: parsedData.time,
            hr: parsedData.hdop
          }))
        }
      })
    })
    this.obd.stdout.on('data', (data: string) => {
      data.split('\n').forEach(d => {
        if (d) {
          console.log('DATA SAVER OBD:', d)
          const parsedData = JSON.parse(d) as OBDCollector
          parsedData.time = new Date().toISOString()
          this.collectedOBDData.push(parsedData)
        }
      })
    })
    this.saveData()
    this.intervalId = setInterval(() => this.saveData(this), 30000)
  }

  public saveData(self = this) {
    if (!self.appPath) self.appPath = 'colletorsave'

    const gpxData = new GarminBuilder();
    gpxData.setSegmentPoints(self.collectedGPSData);

    const obdPath = self.path.join(self.appPath, 'obd', self.filenameOBD)
    const gpxPath = self.path.join(self.appPath, 'gpx', self.filenameGPX)

    self.fs.writeFile(obdPath, JSON.stringify(self.collectedOBDData), { flag: 'w' }, (err) => { if (err) console.log(err) }) //, 'OBD WRITEFILE:', obdPath)})
    self.fs.writeFile(gpxPath, buildGPX(gpxData.toObject()), { flag: 'w' }, (err) => { if (err) console.log(err) }) //, 'GPX WRITEFILE:', gpxPath)})

  }
}
