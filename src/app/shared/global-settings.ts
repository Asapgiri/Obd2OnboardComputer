import { Current, Song } from "../services/media-player-service";

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
    precision: number
  },
  time: {
    refreshInterval: number
  },
  mp: {
    fileDir: string,
    fileDirAfterBuild: string,
    wave: {
      type: string,
      usable_types: string[],
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
    }
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
  }
}
