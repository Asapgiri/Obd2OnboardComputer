import { Current, Song } from "../services/media-player-service";
import { IPlaylist } from "./iplaylist";


export class Playlist implements IPlaylist {
  public isShuffled: boolean
  public isRepeate: boolean

  private playlist: Song[]

  constructor() {
    this.playlist = []
    this.isShuffled = false
    this.isRepeate = false
  }

  public get(): Song[] {
    return this.playlist
  }

  public getSong(index: number): Song {
    if (index && (!this.playlist || index >= this.playlist.length || index < 0)) throw new Error('Playlist not defind or out of index...') 
    return this.playlist[index]
  }

  public set(src: string[] | Song[]): void {
    if (typeof src == typeof this.playlist) {
      this.playlist = src as Song[]
    }
    else {
      this.playlist = []
      src.forEach(songsrc => {
        this.playlist.push({ pretty: (<string>songsrc).slice(0, (<string>songsrc).lastIndexOf('.')), src: songsrc as string })
      })
    }
  }

  public isInitialized(): boolean {
    if (this.playlist && this.playlist != []) return true
    else return false
  }

  public shuffle(current: Current): Current {
    let falseSongList
    const plLength = this.playlist.length

    if (current.song.src != '') {
      falseSongList = this.playlist.filter(x => x != current.song)
      this.playlist = [current.song]
      current.id = 0
    }
    else {
      falseSongList = this.playlist
      this.playlist = []
    }

    for (let i = 0; i < plLength; i++) {
      const random = Math.floor(Math.random() * (falseSongList.length - 1))
      this.playlist.push(falseSongList[random])
      falseSongList.splice(random, 1)
    }

    if (current.song.src == '') current = { song: this.playlist[0], id: 0 }

    return current
  }

  public reset(): void {
    this.playlist = []
  }

  public add(src: Song): void {
    this.playlist.push(src)
  }

  public remove(id: number): void {
    this.playlist.splice(id, 1)
  }

}
