import { Song } from "../media-player-service";

export interface IMediaPlayerService {
  setRepeate(repeate: boolean): void
  setShuffled(shuffled: boolean): void
  isRepeatePlaylist(): boolean
  isUnorderedPlaylist(): boolean

  getCurrentSong(): Song
  getCurrentSongId(): number
  getPlaylist(): Song[]
  getSongs(): Song[]

  shufflePlaylist(): void
  resetPlaylist(index?: number): void
  addToPlaylist(index: number): void
  removeFromPlaylist(index: number): void

  getNextSong(): Song | undefined
  getPreviousSong(): Song | undefined
  seekOnPLaylist(index: number): void
}
