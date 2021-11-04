import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AudioService } from '../services/audio-service';
import { style, animate, AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { GlobalsService } from '../services/globals-service';
import Wave from "@foobar404/wave"
import { MediaPlayerService, Song } from '../services/media-player-service';


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

  //inputEvent: Event = document.createEvent('Event')

  //mediaService: MediaPlayerService
  
  @ViewChild('scrollableMusicTitle') scrollableMusicTitle: ElementRef|any
  @ViewChild('scrollTitleContainer') scrollTitleContainer: ElementRef|any
  @ViewChild('soundbar') soundbar: ElementRef|any
  @ViewChild('audioVisualizer') audioVisualizer: ElementRef | any

  private factory: any
  player: any;

  constructor(private builder: AnimationBuilder, private modalService: NgbModal,
              public audioService: AudioService, public globalsService: GlobalsService,
              public mediaService: MediaPlayerService) {
    this.seekIntervalIds = { timeout: null, interval: null }
    this.isBluetoothPlaying = false

    this.isSelectMusic = false
    this.isSelectMusicFromPlaylist = false
    this.isSeekingMusic = false

    //this.inputEvent.initEvent('input', true, true)

    if (this.isBluetoothPlaying) {
      //desktopCapturer.getSources({ types: ['audio'] }).then(sources => console.log(sources))   =>  .join not a function ERROR
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("enumerateDevices() not supported.");
        return;
      }

      // List cameras and microphones.
      navigator.mediaDevices.getUserMedia({ audio: { deviceId: '02d4710df39355943bc9a1e960ee948dd06b8bc9402473ddd7c94f6327ca84a5' }, video: false }).then(source => {
        this.audioService.audio.srcObject = source
        this.audioService.audio.play()
        this.wave.fromElement(this.audioService.audio.id, 'visualizer', this.globalsService.globalSettings.mp.wave)
        console.log(source)
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
      this.music = { Name: this.mediaService.getCurrentSong().pretty, toggleButton: 'Pause', id: this.mediaService.getCurrentSongId() }
      if (!this.audioService.audio.src) {
        //this.mediaService.resetPlaylist()
        if (this.music.Name) this.audioService.setAudio(`assets/music/${this.mediaService.getCurrentSong().src}`, false)
        this.music.toggleButton = 'Play'
        //this.audioService.setAudio('api/bt')
        this.audioService.audio.addEventListener('timeupdate', () => {
          const el = document.getElementById('sound-bar')
          if (el) el.style.backgroundSize = this.audioService.percentElapsed.getValue() + '%'
          //this.globalsService.globalSettings.mp.player.lastPlayed.time = this.audioService.audio.currentTime
          //this.globalsService.saveSettings()
        })
        this.audioService.audio.addEventListener('ended', () => this.seekNextSong(), false);
        this.audioService.audio.volume = this.globalsService.globalSettings.mp.player.volume
      }
    }
    document.body.appendChild(this.audioService.audio)
    this.wave.fromElement(this.audioService.audio.id, 'visualizer', this.globalsService.globalSettings.mp.wave)

  }




  // Music SECTION
  selectMusic():void {
    this.isSelectMusic = !this.isSelectMusic
    this.isSelectMusicFromPlaylist = false
  }
  showPlaylist(): void {
    this.isSelectMusicFromPlaylist = !this.isSelectMusicFromPlaylist
    this.isSelectMusic = false
  }


  bluetoothSettings():void {

  }

  increaseVolume(): void {
    if (this.audioService.audio.volume < 1)
      this.audioService.audio.volume = parseFloat((this.audioService.audio.volume + .05).toPrecision(2))
    this.globalsService.globalSettings.mp.player.volume = this.audioService.audio.volume
    this.globalsService.saveSettings()
    console.log(this.audioService.audio.volume)
  }

  decreaseVolume(): void {
    if (this.audioService.audio.volume > 0)
      this.audioService.audio.volume = parseFloat((this.audioService.audio.volume - .05).toPrecision(2))
    this.globalsService.globalSettings.mp.player.volume = this.audioService.audio.volume
    this.globalsService.saveSettings()
    console.log(this.audioService.audio.volume)
  }

  toggleAudio(): void {
    this.audioService.toggleAudio() ? this.music.toggleButton = 'Pause' : this.music.toggleButton = 'Play'
  }

  seekNextSong(): void {
    const nextSong = this.mediaService.getNextSong()
    if (nextSong) {
      this.setSong(nextSong, undefined)
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
    if (playlistVal)
      if (seekPlaylist) this.mediaService.seekOnPLaylist(playlistVal)
      else this.mediaService.resetPlaylist(playlistVal)
    this.music = {
      Name: song.pretty,
      toggleButton: 'Pause',
      id: this.mediaService.getCurrentSongId()
    }
    try {
      this.audioService.setAudio(`assets/music/${song.src}`)
    }
    catch (e) {
      this.seekNextSong()
      return
    }
    this.isSelectMusic = false
    
    setTimeout(() => {
      this.initAnimationFactory(true)
      this.wave.fromElement(this.audioService.audio.id, 'visualizer', this.globalsService.globalSettings.mp.wave)
    }, 100)
  }

  seekAudio(e: Event): void {
    this.audioService.seekAudio(parseFloat((e.target as HTMLInputElement).value))
    //this.audioService.seekAudio(400)
    console.log((e.target as HTMLInputElement).value)
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
      this.mediaService.shufflePlaylist()
      this.music.id = 0
      if (!this.audioService.isPlaying()) this.setSong(this.mediaService.getCurrentSong())
    }
    else this.mediaService.resetPlaylist()
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

  openVolume(content: any) {
    this.open(content, {size: 'lg'})
    clearInterval(this.volumeIntervalId)
    this.volumeIntervalId = setInterval(() => this.modalService.dismissAll(), 1000)
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.initAnimationFactory()
  }


  //Private SECTION

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
    }, 1000)
  }

  private initAnimationFactory(doSearch?: boolean) {
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
