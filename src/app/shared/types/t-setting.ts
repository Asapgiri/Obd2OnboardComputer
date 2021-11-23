import { SettingType } from "../enums/e-setting-type";

export type Setting = {
  title: string,
  type: SettingType,
  value: any,
  options?: any,
  function: (objectId: string, param2?: string) => void
}
