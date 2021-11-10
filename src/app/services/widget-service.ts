import { Injectable } from "@angular/core";
import { AppWidget } from "../shared/app-widget";
import { AppsLoader } from "./repo/apps-loader";

@Injectable()
export class WidgetService {
  private loader: AppsLoader = new AppsLoader()

  constructor() { }

  public getWidgets(): AppWidget[] {

    return [
      new AppWidget('Média', 'assets/music-note.png', 'mp'),
      new AppWidget('Térkép', '', 'map'),
      new AppWidget('Összesítés', '', 'overwiev'),
      ...this.loader.gerWidgets()
    ]
  }
}
