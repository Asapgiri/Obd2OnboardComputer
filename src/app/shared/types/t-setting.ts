import { SettingType } from "../enums/e-setting-type";

export type Setting = {
  title: string,
  type: SettingType,
  value: any,
  options?: string[],
  function: () => void
}
