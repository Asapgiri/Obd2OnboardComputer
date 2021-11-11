import { Component, Input, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio-service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GlobalsService } from '../../services/globals-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() public buttonText: string = 'Back'
  @Input() public clickEvent: string = 'notDefinedClickEvent'
  @Input() public parent: any = this
  @Input() public buttonRoute: string[] | null = null
  closeResult = ''

  constructor(private modalService: NgbModal, public audioService: AudioService, public gs: GlobalsService) { }
  
  ngOnInit(): void {
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  buttonClick(): void {
    if (this.parent) {
      if (this.parent[this.clickEvent]) this.parent[this.clickEvent]()
      else throw new Error("Undefined parent event reference.")
    }
  }

  notDefinedClickEvent() {
    throw new Error("Undefined button click Event.")
  }

  closeWindow(): void {
    window.close()
  }

}
