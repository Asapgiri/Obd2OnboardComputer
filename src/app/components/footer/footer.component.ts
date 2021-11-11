import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../../services/globals-service';
import { Obd2Service } from '../../services/obd2-service';
import { DSLimits } from '../../shared/enums/e-driving-style-limits';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private gs: GlobalsService, private obdService: Obd2Service) { }

  ngOnInit(): void {
  }

  getTemperature(): string {
    return this.gs.temperature ? this.gs.temperature : '- ' + this.gs.globalSettings.temp.type
  }

  getTime(): Date {
    return this.gs.time
  }

  getDrivingStyleColor(): string {
    switch (this.obdService.getDrivingStyle()) {
      case DSLimits.VeryGood: return '#00b500'
      case DSLimits.Good: return '#02f72b'
      case DSLimits.Average: return '#ffd500'
      case DSLimits.Impossible: return '#05cdf5'
      default: return '#f70212'
    }
  }
}
