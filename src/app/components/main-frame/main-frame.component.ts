import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../../services/globals-service';

enum buttonText { Apps = 'Apps', Back = 'Back' }

@Component({
  selector: 'app-main-frame',
  templateUrl: './main-frame.component.html',
  styleUrls: ['./main-frame.component.css']
})
export class MainFrameComponent implements OnInit {
  public appsScreen: boolean
  public appsButtonText: string = buttonText.Apps

  
  constructor(public globalsService: GlobalsService) {
    this.appsScreen = false
  }

  ngOnInit(): void {
  }

  changeScreen(): void {
    this.appsScreen = !this.appsScreen
    if (this.appsScreen) this.appsButtonText = buttonText.Back
    else this.appsButtonText = buttonText.Apps
  }

}
