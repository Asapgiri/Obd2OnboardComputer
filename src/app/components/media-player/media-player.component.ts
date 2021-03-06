import { Component, OnInit, ElementRef, ViewChild, HostBinding } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AudioService } from '../../services/audio-service';
import { style, animate, AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { GlobalsService } from '../../services/globals-service';
import Wave from "@foobar404/wave"
import { MediaPlayerService, Song } from '../../services/media-player-service';
import { MpSettings } from '../../shared/global-settings';


@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.css']
})
export class MediaPlayerComponent implements OnInit {
  closeResult = ''
  wave = new Wave()

  isBluetoothPlaying: boolean
  isSelectMusic: boolean
  isSelectMusicFromPlaylist: boolean
  isSeekingMusic: boolean

  seekIntervalIds: { timeout: any, interval: any }
  music: { Name: String, toggleButton: string, id: number }
  mp: MpSettings

  @HostBinding("style.--color-scheme")
  colorScheme: string = '#ff4d4d'

  //inputEvent: Event = document.createEvent('Event')

  //mediaService: MediaPlayerService
  
  @ViewChild('scrollableMusicTitle') scrollableMusicTitle: ElementRef|any
  @ViewChild('scrollTitleContainer') scrollTitleContainer: ElementRef|any
  @ViewChild('soundbar') soundbar: ElementRef|any
  @ViewChild('audioVisualizer') audioVisualizer: ElementRef | any
  @ViewChild('volumebar') volumeBar: ElementRef | any

  private factory: any
  player: any;

  constructor(private builder: AnimationBuilder, private modalService: NgbModal,
              public audioService: AudioService, public globalsService: GlobalsService,
              public mediaService: MediaPlayerService, private elementRef: ElementRef) {
    this.seekIntervalIds = { timeout: null, interval: null }
    this.isBluetoothPlaying = false
    this.mp = this.globalsService.globalSettings.mp

    this.isSelectMusic = false
    this.isSelectMusicFromPlaylist = false
    this.isSeekingMusic = false

    //this.inputEvent.initEvent('input', true, true)

    if (this.isBluetoothPlaying) {
      //desktopCapturer.getSources({ types: ['audio'] }).then(sources => console.log(sources))   =>  .join not a function ERROR
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        if (this.globalsService.globalSettings.developerMode) console.log("enumerateDevices() not supported.");
        return;
      }

      // List cameras and microphones.
      navigator.mediaDevices.getUserMedia({ audio: { deviceId: '02d4710df39355943bc9a1e960ee948dd06b8bc9402473ddd7c94f6327ca84a5' }, video: false }).then(source => {
        this.audioService.audio.srcObject = source
        this.audioService.audio.play()
        this.wave.fromElement(this.audioService.audio.id, 'visualizer', this.mp.wave)
        if (this.globalsService.globalSettings.developerMode) console.log(source)
      })


      navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
          devices.forEach(function (device) {
            console.log(device.kind + ": " + device.label +
              " id = " + device.deviceId);
          });
        })
        .catch(function (err) {
          console.log(err.name + ": " + err.message);
        });

    }
    else {
      this.music = { Name: this.mediaService.getCurrentSong().pretty, toggleButton: 'Play', id: this.mediaService.getCurrentSongId() }
      if (!this.audioService.audio.src) {
        //this.mediaService.resetPlaylist()
        if (this.music.Name) this.audioService.setAudio(this.mediaService.getCurrentSong().src, false)
        this.music.toggleButton = 'Play'
        //this.audioService.setAudio('api/bt')
        this.audioService.audio.addEventListener('timeupdate', () => {
          const el = document.getElementById('sound-bar')
          if (el) el.style.backgroundSize = this.audioService.percentElapsed.getValue() + '%'
          //this.mp.player.lastPlayed.time = this.audioService.audio.currentTime
          //this.globalsService.saveSettings()
        })
        this.audioService.audio.addEventListener('ended', () => this.seekNextSong(), false);
        this.audioService.audio.volume = this.mp.player.volume
      }
    }
    document.body.appendChild(this.audioService.audio)
    this.wave.fromElement(this.audioService.audio.id, 'visualizer', this.mp.wave)

    if (this.mp.playOnStartup && this.mp.player.isPlaying && !this.audioService.isPlaying()) this.toggleAudio()
  }




  // Music SECTION
  selectMusic():void {
    this.isSelectMusic = !this.isSelectMusic
    this.isSelectMusicFromPlaylist = false
  }
  showPlaylist(): void {
    this.isSelectMusicFromPlaylist = !this.isSelectMusicFromPlaylist
    this.isSelectMusic = false
    if (this.player)
      if (this.isSelectMusicFromPlaylist) this.player.pause()
      else {
        setTimeout(() => {
          this.initAnimationFactory(true)
          this.wave.fromElement(this.audioService.audio.id, 'visualizer', this.mp.wave)
        }, 100)
      }
  }


  bluetoothSettings():void {

  }

  increaseVolume(): void {
    if (this.audioService.audio.volume < 1)
      this.audioService.audio.volume = parseFloat((this.audioService.audio.volume + .05).toPrecision(2))
    this.mp.player.volume = this.audioService.audio.volume
    this.globalsService.saveSettings()
    if (this.globalsService.globalSettings.developerMode) console.log(this.audioService.audio.volume)
  }

  decreaseVolume(): void {
    if (this.audioService.audio.volume > 0)
      this.audioService.audio.volume = parseFloat((this.audioService.audio.volume - .05).toPrecision(2))
    this.mp.player.volume = this.audioService.audio.volume
    this.globalsService.saveSettings()
    if (this.globalsService.globalSettings.developerMode) console.log(this.audioService.audio.volume)
  }

  toggleAudio(): void {
    if (this.audioService.toggleAudio()) {
      this.music.toggleButton = 'Pause'
      this.mp.player.isPlaying = true
    }
    else {
      this.music.toggleButton = 'Play'
      this.mp.player.isPlaying = false
    }
    this.globalsService.saveSettings()
  }

  seekNextSong(): void {
    const nextSong = this.mediaService.getNextSong()
    if (nextSong) {
      this.setSong(nextSong, undefined)
    }
    else {
      this.music.toggleButton = 'Play'
      this.mp.player.isPlaying = false
      this.globalsService.saveSettings()
    }
  }
  seekPreviousSong(): void {
    if (this.audioService.audio.currentTime > 10) this.audioService.seekAudio(0)
    else {
      const prevSong = this.mediaService.getPreviousSong()
      if (prevSong) {
        this.setSong(prevSong)
      }
      else this.audioService.seekAudio(0)
    }
  }
  setSong(song: Song, playlistVal?: number, seekPlaylist: boolean = false): void {
    if (this.globalsService.globalSettings.developerMode) console.log('Setting song: ', song)
    this.mp.player.isPlaying = true
    if (playlistVal)
      if (seekPlaylist) this.mediaService.seekOnPLaylist(playlistVal)
      else this.mediaService.resetPlaylist(playlistVal)
    this.music = {
      Name: song.pretty,
      toggleButton: 'Pause',
      id: this.mediaService.getCurrentSongId()
    }
    try {
      if (this.globalsService.globalSettings.developerMode) console.log('Setting song: ', song)
      this.audioService.setAudio(song.src)
      if (this.globalsService.globalSettings.developerMode) console.log('NO ERROR')
    }
    catch (e) {
      this.seekNextSong()
      return
    }
    this.isSelectMusic = false

    if (!this.isSelectMusicFromPlaylist)
      setTimeout(() => {
        this.initAnimationFactory(true)
        this.wave.fromElement(this.audioService.audio.id, 'visualizer', this.mp.wave)
      }, 100)
  }

  seekAudio(e: Event): void {
    this.audioService.seekAudio(parseFloat((e.target as HTMLInputElement).value))
    //this.audioService.seekAudio(400)
    if (this.globalsService.globalSettings.developerMode) console.log((e.target as HTMLInputElement).value)
  }
  getValue(event: Event): number {
    return parseFloat((event.target as HTMLInputElement).value);
  }

  seekTillMouseUp(func: string): void {
    this.clearSeekTillIntervals()
    this.seekIntervalIds.timeout = setTimeout(() => {
      if (func === 'back') this.seekIntervalIds.interval = setInterval(() => this.seekAudioBackward(this.audioService, 1), 20)
      if (func === 'forward') this.seekIntervalIds.interval = setInterval(() => this.seekAudioForward(this.audioService, 1), 20)
      this.seekIntervalIds.timeout = setTimeout(() => {
        this.clearSeekTillIntervals()
        if (func === 'back') this.seekIntervalIds.interval = setInterval(() => this.seekAudioBackward(this.audioService, 2), 10)
        if (func === 'forward') this.seekIntervalIds.interval = setInterval(() => this.seekAudioForward(this.audioService, 2), 10)
      }, 2000);
    }, 500)
  }

  seekAudioBackward(audioService?: AudioService, duration?: number): void {
    const value = duration ? duration : 5
    audioService ? audioService.seekAudio(this.audioService.audio.currentTime - value) :
      this.audioService.seekAudio(this.audioService.audio.currentTime - value)
  }

  seekAudioForward(audioService?: AudioService, duration?: number): void {
    const value = duration ? duration : 5
    audioService ? audioService.seekAudio(this.audioService.audio.currentTime + value) :
      this.audioService.seekAudio(this.audioService.audio.currentTime + value)
  }

  clearSeekTillIntervals(): void {
    clearTimeout(this.seekIntervalIds.timeout)
    clearInterval(this.seekIntervalIds.interval)
  }

  repeateToggle():void {
    this.mediaService.setRepeate(!this.mediaService.isRepeatePlaylist())
  }

  shuffleToggle():void {
    this.mediaService.setShuffled(!this.mediaService.isUnorderedPlaylist())
    if (this.mediaService.isUnorderedPlaylist()) {
      this.music.id = 0
      if (!this.audioService.isPlaying()) this.setSong(this.mediaService.getCurrentSong())
    }
  }

  playAllSongs(isShuffled: boolean = false) {
    this.mediaService.initPlaylist(isShuffled)
    this.setSong(this.mediaService.getCurrentSong())
  }
  





  //Public SECTION

  open(content: any, args?: NgbModalOptions) {
    this.modalService.open(content, args ? args : {ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private volumeIntervalId: any

  openVolume() {
    const tempVolumeBar = this.volumeBar.nativeElement as HTMLElement
    tempVolumeBar.style.width = this.audioService.audio.volume * 100 + '%'
    tempVolumeBar.style.visibility = "visible"

    clearInterval(this.volumeIntervalId)
    this.volumeIntervalId = setInterval(() => { tempVolumeBar.style.visibility = "hidden" }, 1000)
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.initAnimationFactory()
    this.initColorSchemes()
  }


  //Private SECTION

  private initColorSchemes() {
    this.colorScheme = this.mp.colorSceme
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  private animate() {
    setTimeout(() => {
      this.player.reset();
      
      this.player.onDone(() => {
        this.animate();
      })

      this.player.play()
    }, 2000)
  }

  private initAnimationFactory(doSearch?: boolean) {
    if (this.mp.animations) {
      let offset: number
      const container = document.getElementById('title-container')
      const title = document.getElementById('music-title')
      //console.log(container, title)
      if (doSearch && container && title) offset = container.offsetWidth - title.offsetWidth
      else offset = (this.scrollTitleContainer.nativeElement as HTMLElement).offsetWidth - (this.scrollableMusicTitle.nativeElement as HTMLElement).offsetWidth

      if (this.player) this.player.reset()
      if (offset && offset < 0) {
        //(this.scrollableMusicTitle.nativeElement as HTMLElement).style.marginLeft = `${offset}`
        this.factory = this.builder.build([
          style({ left: offset * 1.5 }),
          animate(10000, style({}))
        ]);
        this.player = this.factory.create(this.scrollableMusicTitle.nativeElement, {});
        this.animate();
      }
    }
  }

}
