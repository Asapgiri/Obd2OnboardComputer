import { Routes } from "@angular/router";
import { AppWidget } from "../../shared/app-widget";
import { AppProperties } from "../../shared/types/t-apps-properties";

const fs = window.require('fs')
const path = window.require('path')

export class AppsLoader {
  private foundCompontnts: Routes = []
  private foundApps: AppWidget[] = []

  constructor() {
    try {
      this.findComponents()
    }
    catch (e) {
      console.log(e)
    }
  }

  public getComponents(): Routes {
    return this.foundCompontnts
  }

  public gerWidgets(): AppWidget[] {
    return this.foundApps
  }

  private findComponents() {
    const appsFolder = fs.readdirSync('mods');
    let i = 0
    for (let app of appsFolder) {
      try {
        const properties = JSON.parse(fs.readFileSync(path.join('mods', app, 'properties.json'))) as AppProperties
        const folderRead: string[] = fs.readdirSync(path.join('mods', app))

        const tsFileName = folderRead.find(x => x.split('.')[x.split('.').length - 1] == 'ts')

        this.foundCompontnts.push({
          path: 'mods/' + properties.name + '_' + i,
          loadChildren: () => import('mods/'+app+'/'+tsFileName?.slice(0, tsFileName.lastIndexOf('.'))).then(m => m[properties.className])
        })
        this.foundApps.push(new AppWidget(
          properties.name,
          properties.img,
          'mods/' + properties.name + '_' + i,
          properties.color
        ))

        i++
      }
      catch (e) {
        console.log(e)
      }
    }

    console.log(appsFolder)
  }
}
