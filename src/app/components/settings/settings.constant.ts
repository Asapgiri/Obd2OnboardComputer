import { SettingType } from "../../shared/enums/e-setting-type";
import { SettingsGroup } from "../../shared/types/t-settings-group";

export const SETTINGS_CONSTANT: SettingsGroup[] = [
  {
    title: 'General',
    settings: [
      { title: 'Idő / Dátum', type: SettingType.date, value: new Date(), function: () => { } },
      { title: 'Hőmérséklet', type: SettingType.select, value: gs.temp.type, options: TempType, function: () => { } }
    ]
  },
  {
    title: 'OBD',
    settings: [
      { title: 'Mértékegység', type: SettingType.select, value: gs.metricType, options: MetricType, function: () => { } }
    ]
  },
  {
    title: 'Zene és Média',
    settings: [
      { title: 'Lejátszás indításkor', type: SettingType.check, value: gs.mp.playOnStartup, function: () => { } },
      { title: 'Animációk', type: SettingType.check, value: gs.mp.animations, function: () => { } },
      { title: 'Domináns szín', type: SettingType.colors, value: gs.mp.colorSceme, function: () => { } },
      { title: 'Wave színek', type: SettingType.colors, value: gs.mp.wave.colors, function: () => { } },
      { title: 'Wave typus', type: SettingType.select, value: gs.mp.wave.type, options: WaveType, function: () => { } }
    ]
  },
  {
    title: 'Untitled',
    settings: [
      { title: 'Developer Mode', type: SettingType.check, value: gs.developerMode, function: () => { } }
    ]
  }
]
