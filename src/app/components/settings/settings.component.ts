import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalsService } from '../../services/globals-service';
import { MetricType } from '../../shared/enums/e-metryc-types';
import { SettingType } from '../../shared/enums/e-setting-type';
import { TempType } from '../../shared/enums/e-temps';
import { WaveType } from '../../shared/enums/e-wave-type';
import { GlobalSettings } from '../../shared/global-settings';
import { Setting } from '../../shared/types/t-setting';
import { SettingsGroup } from '../../shared/types/t-settings-group';
import { TIME_ZONES } from './timezones.constant';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settings: SettingsGroup[] = []
  SettingType = SettingType
  ret: string = ''
  execSync = window.require("child_process").execSync;
  
  timezone: string = ''
  newTimezone: string = ''
  timezones: string[] = []

  public colors: string[] = [
    "#ffe252",
    "#ac00e6",
    "#4287f5",
    "#4913c9",
    "#ff4d4d"
  ]

  private gs: GlobalSettings

  constructor(private globals: GlobalsService, private route: ActivatedRoute) {
    this.gs = JSON.parse(JSON.stringify(this.globals.globalSettings))
    this.initSettings() 
    if (this.gs.developerMode) console.log(this.gs)
    this.colors = this.gs.mp.pickableColors
  }

  public saveSettings() {
    this.globals.globalSettings = JSON.parse(JSON.stringify(this.gs))
    this.globals.saveSettings()

    if (this.newTimezone != '' && this.newTimezone != this.timezone) {
      this.execSync(`sudo timedatectl set-timezone ${this.newTimezone}`)
      if (this.gs.developerMode) console.log('New timezonet set: ', this.newTimezone, ', new time: ', new Date())
    }

    if (this.gs.developerMode) console.log(this.gs)
  }

  private initSettings() {
    try {
      this.timezone = this.execSync('timedatectl | grep zone | cut -d" " -f 19', { shell: '/bin/sh' }).toString()
      this.timezones = this.execSync('timedatectl list-timezones', { shell: '/bin/bash' }).toString().split('\n')
    }
    catch (err) {
      if (this.globals.globalSettings.developerMode) console.log(err)
      this.timezone = 'Europe/Budapest'
      this.timezones = TIME_ZONES
    }
    if (this.gs.developerMode) console.log('Timezones', this.timezone, this.timezones)
    const continents: any = {}
    this.timezones.forEach(country => {
      const [cont, ctry] = country.split('/')
      if (continents[cont]) continents[cont].push(ctry)
      else continents[cont] = [ctry]
    })
    if (this.gs.developerMode) console.log(continents)
    this.settings = [
      {
        title: 'Idő és Hőmérséklet',
        settings: [
          {
            title: 'Időzóna',
            type: SettingType.date,
            value: { continent: this.timezone.split('/')[0], zone: this.timezone },
            options: continents,
            function: (objectId: string) => {
              setTimeout(() => {
                const timezone = (document.getElementById(objectId) as HTMLSelectElement).value
                if (this.gs.developerMode) console.log(timezone)
                this.newTimezone = timezone.split(' ')[1]
              }, 100)
            }
          },
          {
            title: 'Hőmérséklet', type: SettingType.select, value: this.gs.temp.type, options: Object.values(TempType), function: (objectId: string) => {
              const tempType = (document.getElementById(objectId) as HTMLButtonElement)
              this.gs.temp.type = tempType.innerText as TempType
              if (this.gs.developerMode) console.log(tempType.innerText)
              const container = (document.getElementById(objectId.slice(0, objectId.lastIndexOf('_'))) as HTMLSpanElement)
              container.childNodes.forEach((child: any) => child.disabled = false)
              tempType.disabled = true

            }
          }
        ]
      },
      {
        title: 'OBD',
        settings: [
          {
            title: 'Mértékegység', type: SettingType.select, value: this.gs.metricType, options: Object.values(MetricType), function: (objectId: string) => {
              const metric = document.getElementById(objectId) as HTMLButtonElement
              this.gs.obd.useMetricSystem = (metric.innerText as MetricType) == MetricType.Metric
              if (this.gs.developerMode) console.log(metric.innerText)
              const container = (document.getElementById(objectId.slice(0, objectId.lastIndexOf('_'))) as HTMLSpanElement)
              container.childNodes.forEach((child: any) => child.disabled = false)
              metric.disabled = true
            }
          }
        ]
      },
      {
        title: 'Zene és Média',
        settings: [
          {
            title: 'Lejátszás indításkor', type: SettingType.check, value: this.gs.mp.playOnStartup, function: (objectId: string) => {
              const playOnStartup = (document.getElementById(objectId) as HTMLInputElement).checked
              this.gs.mp.playOnStartup = playOnStartup
              if (this.gs.developerMode) console.log(playOnStartup)
            } },
          {
            title: 'Animációk', type: SettingType.check, value: this.gs.mp.animations, function: (objectId: string) => {
              const isAnimations = (document.getElementById(objectId) as HTMLInputElement).checked
              this.gs.mp.animations = isAnimations
              if (this.gs.developerMode) console.log(isAnimations)
            } },
          {
            title: 'Domináns szín', type: SettingType.colors, value: [this.gs.mp.colorSceme], function: (objectId: string) => {
              const color = (document.getElementById(objectId) as HTMLInputElement).value
              this.gs.mp.colorSceme = color
              if (this.gs.developerMode) console.log(color)
            }
          },
          {
            title: 'Wave színek', type: SettingType.colors, value: this.gs.mp.wave.colors, function: (objectId: string, index: string) => {
              const color = (document.getElementById(objectId) as HTMLInputElement).value
              this.gs.mp.wave.colors[parseInt(index)] = color
              if (this.gs.developerMode) console.log(color)
            } },
          {
            title: 'Wave típus', type: SettingType.select, value: this.gs.mp.wave.type, options: Object.values(WaveType), function: (objectId: string) => {
              const waveType = document.getElementById(objectId) as HTMLButtonElement
              this.gs.mp.wave.type = waveType.innerText as WaveType
              if (this.gs.developerMode) console.log(waveType.innerText)
              const container = (document.getElementById(objectId.slice(0, objectId.lastIndexOf('_'))) as HTMLSpanElement)
              container.childNodes.forEach((child: any) => child.disabled = false)
              waveType.disabled = true
            }
          }
        ]
      },
      {
        title: 'Rendszer',
        settings: [
          {
            title: 'Fejlesztő mód', type: SettingType.check, value: this.gs.developerMode, function: (objectId: string) => {
              const isDeveloper = (document.getElementById(objectId) as HTMLInputElement).checked
              this.gs.developerMode = isDeveloper
              if (this.gs.developerMode) console.log('DEVELOPER MODE:', isDeveloper)
            }
          }
        ]
      }
    ] as SettingsGroup[]
  }

  ngOnInit(): void {
    const ret = this.route.snapshot.paramMap.get('ret')
    this.ret = ret ? '/' + ret : ''
  }
}
