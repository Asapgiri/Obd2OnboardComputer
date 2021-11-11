import { OBD2Data } from "../../shared/obd2-data";

export interface IObdOverallService {
  getAverageSpeed(): string
  getAverageRPM(): string
  getAverageGear(): string
  getMotorTemps(): string
  getConsumpedFuel(): string
  getTravelled(): string
  getAverageDrivingStyle(): string
  getDrivingTime(): string

  add(data: OBD2Data): void
  loadDataFromFile(): void
}
