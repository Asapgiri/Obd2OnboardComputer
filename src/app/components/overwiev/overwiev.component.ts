import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map-service';
import { ObdOverallService } from '../../services/obd-overall-service';

@Component({
  selector: 'app-overwiev',
  templateUrl: './overwiev.component.html',
  styleUrls: ['./overwiev.component.css']
})
export class OverwievComponent implements OnInit {

  constructor(private ms: MapService, public ovs: ObdOverallService) { }

  ngOnInit(): void {
    // this.ms.generateMap()
  }

}
