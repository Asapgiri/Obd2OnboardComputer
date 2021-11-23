import { Injectable } from '@angular/core'
import { Playlist } from '../shared/playlist'
import { GlobalsService } from './globals-service'
import { IMediaPlayerService } from './ifnteraces/i-media-player-service'

export type Song = { src: string, pretty: string }
export type Current = { song: Song, id: number }

@Injectable()
export class MediaPlayerService implements IMediaPlayerService {
  private songs: Song[] = []
  private playlist: Playlist = new Playlist()
  private current: Current = {
    song: {src:'', pretty:''}, id: 0 }
  //private cf: any
  private self = this

  constructor(private globalsService: GlobalsService) { //, callback?: any) {
    this.init()
  }

  private init() {
    this.initSongs()
    if (!this.playlist.isInitialized()) this.playlist.set(this.globalsService.globalSettings.mp.player.lastPlaylist)

    const self = this
    this.globalsService.usb.stdout.on('data', function (device: any) {
      if (self.globalsService.globalSettings.developerMode) console.log('change', device);
      setTimeout(() => {
        self.initSongs()
        if (self.globalsService.globalSettings.developerMode) console.log(self.songs)
      }, 3000)
    });
  }

  // PUBLIC PART

  public setRepeate(repeate: boolean): void {
    this.playlist.isRepeate = repeate
    this.save()
  }

  public setShuffled(shuffled: boolean): void {
    this.playlist.isShuffled = shuffled
    if (this.playlist.isShuffled) this.shufflePlaylist()
    this.save()
  }

  public isRepeatePlaylist(): boolean {
    return this.playlist.isRepeate
  }

  public isUnorderedPlaylist(): boolean {
    return this.playlist.isShuffled
  }

  public getCurrentSong(): Song {
    if (!this.current.song) {
      if (!this.playlist) this.initPlaylist()
      this.current = { song: this.playlist.getSong(0), id: 0 }
    }
    return this.current.song
  }

  public getCurrentSongId(): number {
    if (!this.current.song) {
      if (!this.playlist) this.initPlaylist()
      this.current = { song: this.playlist.getSong(0), id: 0 }
    }
    return this.current.id
  }

  public getPlaylist(): Song[] {
    return this.playlist.get()
  }

  public getSongs(): Song[] {
    return this.songs
  }

  public shufflePlaylist(): void {
    this.playlist.isShuffled = true
    if (this.playlist.isInitialized()) {
      this.current = this.playlist.shuffle(this.current)
    }
    else this.initPlaylist()
    this.save()
    //console.log(this.getPlaylist())
  }

  public getNextSong(): Song | undefined {
    const nextId = this.current.id+1
    if (nextId < this.playlist.get().length) {
      this.current.id = nextId
      this.current.song = this.playlist.getSong(nextId)
    }
    else {
      if (this.playlist.isRepeate) {
        this.current = {
          song: this.playlist.getSong(0),
          id: 0
        }
      }
      else return undefined
    }
    this.save()
    return this.current.song
  }

  public getPreviousSong(): Song | undefined {
    const prevId = this.current.id-1
    if (prevId >= 0) {
      this.current.id = prevId
      this.current.song = this.playlist.getSong(prevId)
      this.save()
      return this.current.song
    }
    else {
      return undefined
    }
  }

  public resetPlaylist(index?: number): void {
    this.playlist.isShuffled = false
    if (this.globalsService.globalSettings.developerMode) console.log('Current song: ', this.current)
    this.playlist.reset()
    if (this.globalsService.globalSettings.developerMode) console.log('Current song: ', this.current)
    if (this.globalsService.globalSettings.developerMode) console.log('Index value:', index)
    if (typeof index !== 'undefined') {
      this.playlist.add(this.songs[index])
      this.current = { song: this.playlist.getSong(0), id: 0 }
    }
    else this.current = {
      song: {src: '', pretty: ''},
      id: 0
    }

    if (this.globalsService.globalSettings.developerMode) console.log('Current song: ', this.current)

    this.save()
  }

  public addToPlaylist(index: number): void {
    if (index < 0 || index >= this.songs.length) throw new Error("Songs length is not correct..")
    this.playlist.add(this.songs[index])
  }

  public removeFromPlaylist(index: number): void {
    if (index < 0 || index >= this.playlist.get().length) throw new Error("Playlist length is not correct..")
    this.playlist.remove(index)
    if (index < this.current.id) this.current.id--
  }

  public seekOnPLaylist(index: number): void {
    if (index < 0 || index >= this.playlist.get().length) throw new Error("Playlist length is not correct..")
    this.current = { song: this.playlist.getSong(index), id: index }
  }

  public initPlaylist(isShuffled: boolean = false): void {
    this.playlist.isShuffled = isShuffled
    this.playlist.set(this.songs)
    this.current = {
      song: this.playlist.getSong(0),
      id: 0
    }
    if (this.playlist.isShuffled)
      this.current = this.playlist.shuffle()
    this.save()
  }
  


  public initSongs(): void {
    this.songs = this.globalsService.getSongs()
    this.load()
  }

  // PRIVATE PART

  private save(): void {
    let savedPlayer = this.globalsService.globalSettings.mp.player
    savedPlayer.lastPlayed = this.current
    savedPlayer.lastPlaylist = this.playlist.get()
    savedPlayer.isRepeate = this.playlist.isRepeate
    savedPlayer.isShuffle = this.playlist.isShuffled
    this.globalsService.globalSettings.mp.player = savedPlayer
    this.globalsService.saveSettings()
  }

  private load(): void {
    const savedPlayer = this.globalsService.globalSettings.mp.player
    this.current = this.songs.find(song => song.src == savedPlayer.lastPlayed.song?.src) ? savedPlayer.lastPlayed : { song: { pretty: '', src: '' }, id: 0 }
    let canBePlaylist: Song[] = []
    savedPlayer.lastPlaylist.forEach(song => {
      if (this.songs.find(song => song.src == song.src)) canBePlaylist.push(song)
    })
    this.playlist.set(canBePlaylist)
    this.playlist.isRepeate = savedPlayer.isRepeate
    this.playlist.isShuffled = savedPlayer.isShuffle

    if (this.globalsService.globalSettings.developerMode) console.log('Loaded songs: ', this.songs)

    if (!this.current.song) this.current.song = { src: '', pretty: '' }
  }
}
