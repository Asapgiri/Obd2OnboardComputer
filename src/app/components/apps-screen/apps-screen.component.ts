import { Component, OnInit } from '@angular/core';
import { WidgetService } from '../../services/widget-service';
import { AppWidget } from '../../shared/app-widget';

@Component({
  selector: 'app-apps-screen',
  templateUrl: './apps-screen.component.html',
  styleUrls: ['./apps-screen.component.css']
})

export class AppsScreenComponent implements OnInit {

  appWidgets: Array<AppWidget> = []
  widgetService: WidgetService
  
  constructor() {
    this.widgetService = new WidgetService()
  }
  
  ngOnInit(): void {
    this.appWidgets = this.widgetService.getWidgets()
  }

}
