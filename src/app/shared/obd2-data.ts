export type CustumObdArgsByMe = {
    speed?: number,
    gear?: number,
    rev?: number,
    temp?: number,
    fuelCons?: {
        long?: string,
        short?: string
    },
    travelled?: number,
    drivingStyle?: string,
    drivingTime?: number
}

export class OBD2Data {
    public speed: number
    public gear: number
    public rev: number
    public temp: number
    public fuelCons: {
        long: string,
      short: string
    }
    public travelled: number
    public drivingStyle: string
    public drivingTime: number

  constructor(args?: CustumObdArgsByMe | any) {
    this.speed = args && args.speed ? args.speed : 0
    this.gear = args && args.gear ? args.gear : 0
    this.rev = args && args.rev ? args.rev : 0
    this.temp = args && args.temp ? args.temp : 0
    this.travelled = args && args.travelled ? args.travelled : 0
    this.drivingStyle = args && args.drivingStyle ? args.drivingStyle : ''
    this.drivingTime = args && args.drivingTime ? args.drivingTime : 0
    this.fuelCons = args && args.fuelCons ? args.fuelCons : { long: '-', short: '-' }
  }

}
