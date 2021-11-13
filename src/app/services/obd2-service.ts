import { Injectable } from "@angular/core";
import { DSLimits } from "../shared/enums/e-driving-style-limits";
import { OBD2Data } from "../shared/obd2-data";
import { OBDCollector } from "../shared/types/t-obd-collector";
import { DrivingStyler } from "./driving-style";
import { GlobalsService } from "./globals-service";
import { IDrivingStyler } from "./ifnteraces/i-driving-styler";
import { ObdOverallService } from "./obd-overall-service";

@Injectable()
export class Obd2Service {
  public data: OBD2Data
  public isDataFreshAvailable = true
  public isConnectionValid = false
  public isUnableToConnect = false

  private initTime = new Date()
  private lastTravelTime = new Date()
  private intervalId: any
  private pastFuelDataBuffer: number[]
  private bufferSize: number
  private calculateValueIndex: number
  private addedFuelBeforeCalculated: number = 0
  private isJustSturted: boolean = true
  private drivingStyler: IDrivingStyler

  constructor(private globalsService: GlobalsService, private ovs: ObdOverallService) {
    this.data = new OBD2Data()
    this.bufferSize = 3600000 / this.globalsService.globalSettings.obd.refreshInterval
    this.calculateValueIndex = this.bufferSize / 4
    this.pastFuelDataBuffer = []
    this.initOBD2()
    this.drivingStyler = new DrivingStyler(this.globalsService.getAppPath())
  }

  public getDrivingStyle(): DSLimits {
    return this.drivingStyler.getDrivingStyle()
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

        self.calculateGear(self)
        self.calculateTime(self)
        self.calculateTravelled(self)
        self.ovs.add(self.data)
        self.data.drivingStyle = self.drivingStyler.calculateNextDS(self.data)
      });

      if (!this.globalsService.obd) {
        this.removeInterval()
        this.intervalId = setInterval(() => this.data = new OBD2Data(this.globalsService.getOBD2Data()), this.globalsService.globalSettings.obd.refreshInterval)
      }
    }, 2000)
  }

  private calculateConsumptioton(self: this, maf: number): void {
    if (self.data.speed > 0) {
      self.data.fuelCons.short = (maf / self.data.speed * 0.3969).toPrecision(self.globalsService.globalSettings.obd.precision) //  l/100km: (3600 * MAF)/(9069.90 * VSS)
      if (self.pastFuelDataBuffer.length > self.bufferSize) self.pastFuelDataBuffer.pop()
      self.pastFuelDataBuffer.push(parseFloat(self.data.fuelCons.short))
      self.addedFuelBeforeCalculated++

      if (self.addedFuelBeforeCalculated > self.calculateValueIndex || (self.isJustSturted && self.addedFuelBeforeCalculated > 25)) {
        let sum = 0
        self.pastFuelDataBuffer.forEach(data => sum += data)
        self.data.fuelCons.long = parseFloat((sum / this.pastFuelDataBuffer.length).toPrecision(self.globalsService.globalSettings.obd.precision)).toString()
        
        self.addedFuelBeforeCalculated = 0
        self.isJustSturted = false
      }

    }
    else self.data.fuelCons.short = '-'
  }

  private calculateGear(self: this): void {
    if (self.data.speed < 0) self.data.gear = -1
    else if (self.data.speed == 0 || self.data.speed > 20 && self.data.rev < 1000) self.data.gear = 0
    else {
      const geerVal = self.data.rev / self.data.speed
      if (geerVal < 35) self.data.gear = 5
      else if (geerVal < 50) self.data.gear = 4
      else if (geerVal < 70) self.data.gear = 3
      else if (geerVal < 100) self.data.gear = 2
      else self.data.gear = 1
    }
  }

  private calculateTravelled(self: this): void {
    const travelledTime = ((new Date()).getTime() - self.lastTravelTime.getTime()) / 3600000
    self.data.travelled += travelledTime * self.data.speed
    self.lastTravelTime = new Date()
  }

  private calculateTime(self: this): void {
    self.data.drivingTime = Math.abs((new Date()).getTime() - self.initTime.getTime()) / (1000 * 60) % 60;
  }

  public getDrivingTime(): string {
    const minutes = this.data.drivingTime
    if (minutes < 1) return '-'
    const hours = (minutes / 60).toFixed()

    return hours != '0' ? hours + ' óra, ' + (minutes % 60).toFixed() + ' perc' : minutes.toFixed() + ' perc'
  }

  public getTravelled(): string {
    return this.globalsService.globalSettings.obd.useMetricSystem ?
      parseFloat(this.data.travelled.toPrecision(2)) + ' km' :
      parseFloat((this.data.travelled * 0.621371192).toPrecision(2)) + ' mérföld'
  }
}
