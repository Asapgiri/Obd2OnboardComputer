import { OBD2Data } from "../../shared/obd2-data";
import { DrivingValues } from "../../shared/types/t-driving-values";

export interface IDrivingStyler {
  getActualDrivingStyle(): DrivingValues
  getDrivingStyles(): DrivingValues[]
  calculateNextDS(): void,
  save(): void
}
