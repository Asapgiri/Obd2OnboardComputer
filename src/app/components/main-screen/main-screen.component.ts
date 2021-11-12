import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalsService } from '../../services/globals-service';
import { MapService } from '../../services/map-service';
import { Obd2Service } from '../../services/obd2-service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit, OnDestroy {

  constructor(private mapService: MapService, public obd2Service: Obd2Service, public globalsService: GlobalsService) {
  }

  ngOnInit(): void {
    // this.obd2Service.initOBD2()
    this.mapService.destroyMap()
    setTimeout(() => {
      this.mapService.generateMap(false)
    }, 300)
  }

  ngOnDestroy(): void {
    // this.obd2Service.removeInterval()
  }


}
