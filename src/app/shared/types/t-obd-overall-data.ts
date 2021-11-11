import { DSLimits } from "../enums/e-driving-style-limits";

export type ObdOverallData = {
  speed: number,
  rev: number,
  gear: number,
  temp: number,
  fuelConsml: number,
  travelled: number,
  DS: string,
  dtime: number
}
