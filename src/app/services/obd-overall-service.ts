import { Injectable } from "@angular/core";
import { OBD2Data } from "../shared/obd2-data";
import { ObdOverallData } from "../shared/types/t-obd-overall-data";
import { GlobalsService } from "./globals-service";
import { IObdOverallService } from "./ifnteraces/i-obd-overall-service";

@Injectable()
export class ObdOverallService implements IObdOverallService {
  private overallList: ObdOverallData[] = []

  constructor(private gs: GlobalsService) {}

  add(data: OBD2Data): void {
    this.overallList.push({
      speed: data.speed,
      rev: data.rev,
      gear: data.gear,
      temp: data.temp,
      fuelConsml: parseFloat(data.fuelCons.short), // TODO: Change to something useful
      travelled: data.travelled,
      DS: data.drivingStyle,
      dtime: data.drivingTime
    })
  }

  getAverageSpeed(): string {
    let sum = 0
    this.overallList.forEach(data => sum += data.speed)
    const average = sum / this.overallList.length

    return this.gs.globalSettings.obd.useMetricSystem ?
      average.toFixed() + ' km/h' :
      (average * 0.621371192).toFixed() + ' mph'
  }

  getAverageRPM(): string {
    let sum = 0
    this.overallList.forEach(data => sum += data.rev)
    const average = sum / this.overallList.length
    return average.toFixed()
  }

  getAverageGear(): string {
    let sum = 0
    this.overallList.forEach(data => sum += data.gear)
    const average = Math.round(sum / this.overallList.length)
    return average.toString()
  }

  getMotorTemps(): string {
    let sum = 0, max = 0
    this.overallList.forEach(data => {
      sum += data.temp
      if (data.temp > max) max = data.temp
    })
    const average = this.gs.setTemperature(sum / this.overallList.length)
    const maxT = this.gs.setTemperature(max)

    return average + ' - ' + maxT
  }

  getConsumpedFuel(): string {
    let sum = 0
    this.overallList.forEach(data => sum += data.fuelConsml)
    return sum + ' l'
  }

  getTravelled(): string {
    if (this.overallList.length == 0) return '-'
    const travelled = this.overallList[this.overallList.length - 1].travelled

    return this.gs.globalSettings.obd.useMetricSystem ?
      parseFloat(travelled.toPrecision(2)) + ' km' :
      parseFloat((travelled * 0.621371192).toPrecision(2)) + ' mérföld'
  }

  getAverageDrivingStyle(): string {
    if (this.overallList.length == 0) return '-'
    let counter: any = {}
    this.overallList.forEach(data => {
      if (counter[data.DS]) counter[data.DS]++
      else counter[data.DS] = 1
    })

    let highest = {name:'', used:0}
    for (let key in counter) {
      if (counter[key] > highest.used) highest = { name: key, used: counter[key]}
    }

    return highest.name
  }

  getDrivingTime(): string {
    if (this.overallList.length == 0) return '-'
    const minutes = this.overallList[this.overallList.length - 1].dtime
    if (minutes < 1) return '-'
    const hours = (minutes / 60).toFixed()

    return hours != '0' ? hours + ' óra, ' + (minutes % 60).toFixed() + ' perc' : minutes.toFixed() + ' perc'
  }

  loadDataFromFile(): void {
    throw new Error("Method not implemented.");
  }

}
