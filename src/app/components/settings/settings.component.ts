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


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settings: SettingsGroup[] = []
  SettingType = SettingType
  ret: string = ''

  private gs: GlobalSettings

  constructor(private globals: GlobalsService, private route: ActivatedRoute) {
    this.gs = JSON.parse(JSON.stringify(this.globals.globalSettings))
    this.initSettings()
  }

  public saveSettings() {
    this.globals.globalSettings = this.gs
    this.globals.saveSettings()

    console.log(this.gs)
  }

  private initSettings() {
    this.settings = [
      {
        title: 'General',
        settings: [
          {
            title: 'Idő / Dátum', type: SettingType.date, value: new Date(), function: (dateId: string, timeId: string) => {
              const date = (document.getElementById(dateId) as HTMLInputElement).value
              const time = (document.getElementById(timeId) as HTMLInputElement).value
              console.log(date, time)
            }
          },
          {
            title: 'Hőmérséklet', type: SettingType.select, value: this.gs.temp.type, options: Object.values(TempType), function: (objectId: string) => {
              const tempType = (document.getElementById(objectId) as HTMLSelectElement).value.split(' ')[1]
              this.gs.temp.type = tempType as TempType
              console.log(tempType)
            }
          }
        ]
      },
      {
        title: 'OBD',
        settings: [
          {
            title: 'Mértékegység', type: SettingType.select, value: this.gs.metricType, options: Object.values(MetricType), function: (objectId: string) => {
              const metric = (document.getElementById(objectId) as HTMLSelectElement).value.split(' ')[1]
              this.gs.obd.useMetricSystem = (metric as MetricType) == MetricType.Metric
              console.log(metric)
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
              console.log(playOnStartup)
            } },
          {
            title: 'Animációk', type: SettingType.check, value: this.gs.mp.animations, function: (objectId: string) => {
              const isAnimations = (document.getElementById(objectId) as HTMLInputElement).checked
              this.gs.mp.animations = isAnimations
              console.log(isAnimations)
            } },
          {
            title: 'Domináns szín', type: SettingType.colors, value: [this.gs.mp.colorSceme], function: (objectId: string) => {
              const color = (document.getElementById(objectId) as HTMLInputElement).value
              this.gs.mp.colorSceme = color
              console.log(color)
            }
          },
          {
            title: 'Wave színek', type: SettingType.colors, value: this.gs.mp.wave.colors, function: (objectId: string, index: string) => {
              const color = (document.getElementById(objectId) as HTMLInputElement).value
              this.gs.mp.wave.colors[parseInt(index)] = color
              console.log(color)
            } },
          {
            title: 'Wave typus', type: SettingType.select, value: this.gs.mp.wave.type, options: Object.values(WaveType), function: (objectId: string) => {
              const waveType = (document.getElementById(objectId) as HTMLSelectElement).value.split(' ')[1]
              this.gs.mp.wave.type = waveType as WaveType
              console.log(waveType)
            }
          }
        ]
      },
      {
        title: 'Untitled',
        settings: [
          {
            title: 'Developer Mode', type: SettingType.check, value: this.gs.developerMode, function: (objectId: string) => {
              const isDeveloper = (document.getElementById(objectId) as HTMLInputElement).checked
              this.gs.developerMode = isDeveloper
              console.log('DEVELOPER MODE:', isDeveloper)
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
