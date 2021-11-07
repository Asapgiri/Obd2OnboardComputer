import { Current, Song } from "../services/media-player-service";
import { MetricType } from "./enums/e-metryc-types";
import { TempType } from "./enums/e-temps";
import { WaveType } from "./enums/e-wave-type";

export type GlobalSettings = {
  assetDir: string,
  map: {
    minZoom: number,
    maxZoom: number,
    defaultZoom: number,
    lastCoordinates: {
      lng: number,
      lat: number
    }
  },
  temp: {
    refreshInterval: number,
    precision: number,
    type: TempType
  },
  time: {
    refreshInterval: number
  },
  mp: {
    fileDir: string
    wave: {
      type: WaveType
      stroke: number,
      colors: string[]
    },
    deviceId: string,
    player: {
      lastPlayed: Current,
      lastPlaylist: Song[],
      isRepeate: boolean,
      isShuffle: boolean,
      volume: number
    },
    playOnStartup: boolean,
    animations: boolean,
    colorSceme: string
  },
  api: {
    url: string,
    mp: string,
    obd: string,
    temp: string,
    gps: string
  },
  obd: {
    refreshInterval: number,
    useMetricSystem: boolean,
    precision: number,
    isConnected: boolean,
    port: string,
    pollers: string[],
    options: {
      baudRate: number
    }
  },
  developerMode: boolean,
  metricType: MetricType
}
