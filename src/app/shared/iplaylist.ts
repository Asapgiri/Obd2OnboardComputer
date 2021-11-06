import { Current, Song } from "../services/media-player-service";

export interface IPlaylist {
  isShuffled: boolean
  isRepeate: boolean
  get(): Song[]
  getSong(index: number): Song
  set(src: Song[] | string[]): void
  isInitialized(): boolean
  shuffle(current: Current): Current
  reset(): void
  add(src: Song): void
  remove(id: number): void
}
