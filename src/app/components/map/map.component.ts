import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapService } from '../../services/map-service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public ret = '/'

  constructor(private mapService: MapService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.mapService.destroyMap()
    setTimeout(() => {
      this.mapService.generateMap()
      this.mapService.removeBorders()
      if (this.route.snapshot.paramMap.get('overwiev')) {
        this.mapService.loadTravelledRoad()
        this.ret = '/overwiev'
      }
    }, 300)
  }

}
