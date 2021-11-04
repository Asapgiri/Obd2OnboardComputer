import { Injectable } from "@angular/core";
import { AppWidget } from "../shared/app-widget";

@Injectable()
export class WidgetService {
  constructor() { }

  public getWidgets(): AppWidget[] {
    return [
      new AppWidget('Média', 'assets/music-note.png', 'mp')
    ]
  }
}
