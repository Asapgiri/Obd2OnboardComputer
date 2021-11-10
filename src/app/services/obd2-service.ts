import { Injectable } from "@angular/core";
import { OBD2Data } from "../shared/obd2-data";
import { OBDCollector } from "../shared/types/t-obd-collector";
import { DrivingStyler } from "./driving-style";
import { GlobalsService } from "./globals-service";
import { IDrivingStyler } from "./ifnteraces/i-driving-styler";

@Injectable()
export class Obd2Service {
  public data: OBD2Data
  public isDataFreshAvailable = true
  public isConnectionValid = false
  public isUnableToConnect = false

  private intervalId: any
  private pastFuelDataBuffer: number[]
  private bufferSize: number
  private calculateValueIndex: number
  private addedFuelBeforeCalculated: number = 0
  private isJustSturted: boolean = true
  private drivingStyler: IDrivingStyler

  constructor(private globalsService: GlobalsService) {
    this.data = new OBD2Data()
    this.bufferSize = 3600000 / this.globalsService.globalSettings.obd.refreshInterval
    this.calculateValueIndex = this.bufferSize / 4
    this.pastFuelDataBuffer = []
    this.initOBD2()
    this.drivingStyler = new DrivingStyler(this.data, this.globalsService.getAppPath())
  }

  public removeInterval(): void {
    clearInterval(this.intervalId)
  }

  public initOBD2(): void {
    //this.removeInterval()
    this.data = new OBD2Data()
    this.requestObdData()
    //this.intervalId = setInterval(() => this.requestObdData(), this.globalsService.globalSettings.obd.refreshInterval)
  }

  private requestObdData(): void {
    const self = this
    setTimeout(() => {
      if (this.globalsService.obd) this.globalsService.obd.stdout.on('data', (data: string) => {
        console.log('OBD2 SERVICE:', data);

        data.split('\n').forEach(d => {
          if (d) {
            console.log(d)
            const parsedData = JSON.parse(d) as OBDCollector
            if (parsedData.name) {
              switch (parsedData.name) {
                case 'vss': self.data.speed = parsedData.value as number; break
                case 'rpm': self.data.rev = parsedData.value as number; break
                case 'temp': self.data.temp = parsedData.value as number; break
                case 'maf': self.calculateConsumptioton(self, parsedData.value as number); break
              }

              self.isDataFreshAvailable = true
              self.isConnectionValid = true
              self.isUnableToConnect = false
            }
            else {
              if (parsedData.value == 'SEARCHING...') self.isConnectionValid = false
              else if (parsedData.value == 'UNABLE TO CONNECT') self.isUnableToConnect = true
              self.isDataFreshAvailable = false
            }
          }
        })

        self.drivingStyler.calculateNextDS()
      });

      if (!this.globalsService.obd) {
        this.removeInterval()
        this.intervalId = setInterval(() => this.data = new OBD2Data(this.globalsService.getOBD2Data()), this.globalsService.globalSettings.obd.refreshInterval)
      }
    }, 2000)
  }

  private calculateConsumptioton(self: this, maf: number) {
    if (self.data.speed > 0) {
      self.data.fuelCons.short = (maf / self.data.speed * 0.3969).toPrecision(self.globalsService.globalSettings.obd.precision) //  l/100km: (3600 * MAF)/(9069.90 * VSS)
      if (self.pastFuelDataBuffer.length > self.bufferSize) self.pastFuelDataBuffer.pop()
      self.pastFuelDataBuffer.push(parseFloat(self.data.fuelCons.short))
      self.addedFuelBeforeCalculated++

      if (self.addedFuelBeforeCalculated > self.calculateValueIndex || (self.isJustSturted && self.addedFuelBeforeCalculated > 25)) {
        let sum = 0
        self.pastFuelDataBuffer.forEach(data => sum += data)
        self.data.fuelCons.long = (sum / this.pastFuelDataBuffer.length * 100).toPrecision(self.globalsService.globalSettings.obd.precision)
        
        self.addedFuelBeforeCalculated = 0
        self.isJustSturted = false
      }

    }
    else self.data.fuelCons.short = '-'
  }

}
