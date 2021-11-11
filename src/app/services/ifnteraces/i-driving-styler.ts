import { DSLimits } from "../../shared/enums/e-driving-style-limits";
import { OBD2Data } from "../../shared/obd2-data";
import { DrivingValues } from "../../shared/types/t-driving-values";

export interface IDrivingStyler {
  getActualDrivingStyle(): DrivingValues
  getDrivingStyles(): DrivingValues[]
  getDrivingStyle(): DSLimits
  calculateNextDS(data: OBD2Data): string,
  save(): void
}
