import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../../services/globals-service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public globalsService: GlobalsService) { }

  ngOnInit(): void {
  }

}
