import { DSLimits } from "../shared/enums/e-driving-style-limits";
import { OBD2Data } from "../shared/obd2-data";
import { DrivingValues } from "../shared/types/t-driving-values";
import { IDrivingStyler } from "./ifnteraces/i-driving-styler";
import * as fs from 'fs'
import path from 'path'

export class DrivingStyler implements IDrivingStyler {
  private actualDS: DrivingValues = { vss: 0, rpm: 0, fc: 0, DS: 0, time: '' }
  private postDS: DrivingValues[] = []
  private data: OBD2Data
  private drivingStyle: DSLimits = DSLimits.Impossible
  private fileName: string = new Date().toISOString().replace(/[ &\/\\#,+()$~%.'":*?<>{}]/g, '-') + '.ds.json'
  private fs: typeof fs = window.require('fs')
  private path: typeof path = window.require('path')

  constructor(data: OBD2Data, private appPath: string) {
    this.data = data
    setInterval(() => this.save(this), 30000)
  }

  public calculateNextDS(): void {
    this.actualDS = {
      vss: this.data.speed,
      rpm: this.data.rev,
      fc: parseFloat(this.data.fuelCons.short.split(' ')[0]),
      DS: 0,
      time: new Date().toISOString()
    }
    this.actualDS.DS = this.actualDS.rpm / this.actualDS.vss * this.actualDS.fc
    if (this.actualDS.DS) this.postDS.push(this.actualDS)
    this.data.drivingStyle = this.drivingStyleSringify()
  }

  public getActualDrivingStyle(): DrivingValues {
    return this.actualDS
  }

  public getDrivingStyles(): DrivingValues[] {
    return this.postDS
  }

  public save(self = this): void {
    const fpath = self.path.join(self.appPath, 'ds')
    if (!self.fs.existsSync(fpath)) self.fs.mkdirSync(fpath)

    self.fs.writeFile(self.path.join(fpath, self.fileName), JSON.stringify(self.postDS), { flag: 'w' }, (err) => { if (err) console.log(err) })
  }

  private drivingStyleSringify(): string {
    let drivingStyle = '-'

    if (this.actualDS.DS <= DSLimits.Impossible) {
      this.drivingStyle = DSLimits.Impossible
    }
    else if (this.actualDS.DS <= DSLimits.VeryGood) {
      this.drivingStyle = DSLimits.VeryGood
      drivingStyle = 'Nagyon Jó'
    }
    else if (this.actualDS.DS <= DSLimits.Good) {
      this.drivingStyle = DSLimits.Good
      drivingStyle = 'Jó'
    }
    else if (this.actualDS.DS <= DSLimits.Average) {
      this.drivingStyle = DSLimits.Average
      drivingStyle = 'Átlagos'
    }
    else {
      this.drivingStyle = DSLimits.Bad
      drivingStyle = 'Rossz/Sportos'
    }

    return drivingStyle
  }
}
